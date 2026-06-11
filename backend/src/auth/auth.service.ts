/**
 * Core of authentication: password verification (bcrypt), issuing token pairs (short JWT + opaque refresh token stored in Redis), refresh token rotation and registration via an access code.
 */
import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto } from './dto/login.dto';
import { TokenPair } from './interfaces/token-pair.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Nesprávný email nebo heslo');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Nesprávný email nebo heslo');

    if (user.role !== 'admin') throw new ForbiddenException('Tento účet nemá oprávnění k administraci');

    return this.issueTokenPair(user.id, user.role);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const [userId, tokenId] = refreshToken.split('.');
    if (!userId || !tokenId) throw new UnauthorizedException();

    const key = `refresh:${userId}:${tokenId}`;
    const exists = await this.redisService.exists(key);
    if (!exists) throw new UnauthorizedException('Relace vypršela, přihlaste se znovu');

    await this.redisService.del(key);

    const user = await this.usersService.findById(userId);
    if (!user || user.role !== 'admin') throw new UnauthorizedException();

    return this.issueTokenPair(user.id, user.role);
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    const [userId, tokenId] = refreshToken.split('.');
    if (!userId || !tokenId) return;
    await this.redisService.del(`refresh:${userId}:${tokenId}`);
  }

  async userLogin(dto: LoginDto): Promise<TokenPair> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Nesprávný email nebo heslo');
    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Nesprávný email nebo heslo');
    return this.issueTokenPair(user.id, user.role, 'user');
  }

  async userRefresh(refreshToken: string): Promise<TokenPair> {
    const [userId, tokenId] = refreshToken.split('.');
    if (!userId || !tokenId) throw new UnauthorizedException();
    const key = `user-refresh:${userId}:${tokenId}`;
    const exists = await this.redisService.exists(key);
    if (!exists) throw new UnauthorizedException('Relace vypršela, přihlaste se znovu');
    await this.redisService.del(key);
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.issueTokenPair(user.id, user.role, 'user');
  }

  async userLogout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    const [userId, tokenId] = refreshToken.split('.');
    if (!userId || !tokenId) return;
    await this.redisService.del(`user-refresh:${userId}:${tokenId}`);
  }

  async checkEmail(email: string): Promise<{ hasAccount: boolean; hasCourseAccess: boolean }> {
    const user = await this.usersService.findByEmail(email);

    return { hasAccount: !!user, hasCourseAccess: !!user };
  }

  async checkCode(code: string): Promise<{ valid: boolean; courseId?: string; usedByEmail?: string | null }> {
    const rows = await this.dataSource.query(
      `SELECT course_id, status, valid_from, valid_until FROM access_codes WHERE code = $1 LIMIT 1`,
      [(code ?? '').trim().toUpperCase()],
    );
    if (!rows.length) return { valid: false };
    const r = rows[0];
    const now = new Date();
    const valid =
      r.status === 'active' &&
      (!r.valid_from || new Date(r.valid_from) <= now) &&
      (!r.valid_until || new Date(r.valid_until) >= now);
    return { valid, courseId: r.course_id, usedByEmail: null };
  }

  async register(email: string, password: string, source: 'email' | 'code', code?: string): Promise<TokenPair> {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Účet s tímto emailem již existuje');

    if (source !== 'code') {
      throw new BadRequestException('Registrace je možná pouze pomocí přístupového kódu.');
    }
    if (!code) throw new BadRequestException('Kód je povinný');

    const rows = await this.dataSource.query(
      `SELECT id, course_id, group_id, status, valid_from, valid_until
       FROM access_codes WHERE code = $1 LIMIT 1`,
      [code.trim().toUpperCase()],
    );
    if (!rows.length) throw new BadRequestException('Neplatný kód');
    const rec = rows[0];
    if (rec.status !== 'active') throw new BadRequestException('Tento kód byl již použit nebo zneplatněn');
    const now = new Date();
    if (rec.valid_from && new Date(rec.valid_from) > now) throw new BadRequestException('Kód zatím neplatí');
    if (rec.valid_until && new Date(rec.valid_until) < now) throw new BadRequestException('Platnost kódu vypršela');

    const hash = await bcrypt.hash(password, 12);
    const user = this.userRepo.create({ email, password_hash: hash, role: 'user' });
    const saved = await this.userRepo.save(user);

    await this.dataSource.query(
      `INSERT INTO user_course_assignments (user_id, course_id)
       VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING`,
      [saved.id, rec.course_id],
    );
    if (rec.group_id) {
      await this.dataSource.query(
        `INSERT INTO user_group_members (group_id, user_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [rec.group_id, saved.id],
      );
    }
    await this.dataSource.query(
      `UPDATE access_codes SET status = 'used', used_by_user_id = $1, used_at = NOW() WHERE id = $2`,
      [saved.id, rec.id],
    );

    return this.issueTokenPair(saved.id, 'user', 'user');
  }

  private async issueTokenPair(userId: string, role: string, tokenType: 'admin' | 'user' = 'admin'): Promise<TokenPair> {
    const expiresIn = this.config.get<string>('jwt.expiresIn') ?? '15m';
    const user = await this.usersService.findById(userId);

    const accessToken = this.jwtService.sign({ sub: userId, role, email: user?.email }, { expiresIn } as any);

    const tokenId = uuid();
    const ttl = this.config.get<number>('refreshToken.ttlSeconds') ?? 604800;
    const prefix = tokenType === 'user' ? 'user-refresh' : 'refresh';
    await this.redisService.set(`${prefix}:${userId}:${tokenId}`, '1', ttl);

    return { accessToken, refreshToken: `${userId}.${tokenId}` };
  }
}
