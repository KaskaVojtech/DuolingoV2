import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../DTOs/user/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { UserStatus } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { Response, Request } from 'express';
import { LoginDto } from 'src/DTOs/auth/login.dto';

const ACCESS_TOKEN_TTL = 60 * 15;        // 15 minut
const REFRESH_TOKEN_TTL = 60 * 60 * 24; // 1 den
const REDIS_REFRESH_PREFIX = 'lucys_english:refresh:';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
        private readonly jwt: JwtService,
        private readonly redis: RedisService
    ) { }

    async login(loginDto: LoginDto, res: Response) {
        const { email, password } = loginDto;

        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordMatch = await bcrypt.compare(password, user.passHash);
        if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

        if (user.status === UserStatus.PENDING) {
            throw new UnauthorizedException('Please verify your email first');
        }

        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);
        await this.storeRefreshToken(user.id, refreshToken);
        this.setTokenCookies(res, accessToken, refreshToken);

        return { message: 'Login successful' };
    }

    async register(registerDto: RegisterDto) {

        const { email, password, confirmPassword } = registerDto;
        const existingUser = await this.usersService.findByEmail(email);

        if (password !== confirmPassword) {
            throw new BadRequestException('Passwords are not the same');
        }

        if (existingUser) {
            if (existingUser.status === UserStatus.PENDING) {
                await this.emailService.createRegisterVerification(existingUser.id, email);
                throw new BadRequestException('Account is pending, verification email has been resent.');
            }
            throw new BadRequestException('User with this email already exists');
        }

        const user = await this.usersService.createUser({
            email,
            password,
        });

        await this.emailService.createRegisterVerification(user.id, email);

        return { message: 'Registration was successful, check your email.' };

    }

    async verifyEmail(token: string) {
        const userId = await this.emailService.resolveVerificationToken(token);

        if (!userId) {
            throw new BadRequestException('Token is invalid or expired');
        }

        await this.usersService.activateUser(userId);

        return { message: 'Email was successfully verified' };
    }

    async logout(req: Request, res: Response) {
        const token = req.cookies?.['refresh_token'];

        if (token) {
            try {
                const payload = this.jwt.verify(token, { secret: process.env.JWT_REFRESH_SECRET! });
                await this.redis.del(`${REDIS_REFRESH_PREFIX}${(payload as any).sub}`);
            } catch { }
        }

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'Logged out' };
    }

    async refresh(req: Request, res: Response) {
        const token = req.cookies?.['refresh_token'];
        if (!token) throw new UnauthorizedException('No refresh token');

        let payload: { sub: number; email: string, role: string };
        try {
            payload = this.jwt.verify(token, { secret: process.env.JWT_REFRESH_SECRET! });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const stored = await this.redis.get(`${REDIS_REFRESH_PREFIX}${payload.sub}`);
        if (stored !== token) throw new UnauthorizedException('Refresh token mismatch');

        const { accessToken, refreshToken } = await this.generateTokens(payload.sub, payload.email, payload.role);
        await this.storeRefreshToken(payload.sub, refreshToken);
        this.setTokenCookies(res, accessToken, refreshToken);

        return { message: 'Tokens refreshed' };
    }

    //-----------------------------------------------------
    //                    HELPERS
    //-----------------------------------------------------

    private async generateTokens(userId: number, email: string, role: string) {
        const payload = { sub: userId, email, role };

        const accessToken = this.jwt.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET!,
            expiresIn: ACCESS_TOKEN_TTL,
        });

        const refreshToken = this.jwt.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET!,
            expiresIn: REFRESH_TOKEN_TTL,
        });

        return { accessToken, refreshToken };
    }

    private async storeRefreshToken(userId: number, refreshToken: string) {
        await this.redis.set(
            `${REDIS_REFRESH_PREFIX}${userId}`,
            refreshToken,
            REFRESH_TOKEN_TTL,
        );
    }

    private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: ACCESS_TOKEN_TTL * 1000,
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: REFRESH_TOKEN_TTL * 1000,
        });
    }
}