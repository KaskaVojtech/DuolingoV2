/**
 * Access to users: lookup by email/id and operations over user accounts.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly dataSource: DataSource,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async createAdmin(email: string, password: string): Promise<User> {
    const password_hash = await bcrypt.hash(password, 12);
    return this.usersRepository.create({ email, password_hash, role: 'admin' });
  }

  async findAll(search: string, page: number, pageSize: number) {
    const { items, totalCount } = await this.usersRepository.findAll(search, page, pageSize);
    return {
      items: items.map((u) => ({ id: u.id, email: u.email, role: u.role, createdAt: u.created_at.toISOString() })),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  async getUserDetail(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return { id: user.id, email: user.email, role: user.role, createdAt: user.created_at.toISOString() };
  }

  async getUserCourses(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const direct = await this.dataSource.query(
      `SELECT uca.id, uca.course_id, uca.assigned_at,
              c.title AS course_title, c.thumbnail_color
       FROM user_course_assignments uca
       JOIN courses c ON c.id = uca.course_id
       WHERE uca.user_id = $1
       ORDER BY uca.assigned_at DESC`,
      [userId],
    );

    return direct.map((r: any) => ({
      accessId: r.id,
      courseId: r.course_id,
      courseTitle: r.course_title,
      thumbnailColor: r.thumbnail_color,
      type: 'email' as const,
      code: null,
      status: 'active',
      validFrom: null,
      validUntil: null,
      lastLoginAt: null,
      createdAt: r.assigned_at,
    }));
  }

  async assignCourse(userId: string, courseId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    await this.dataSource.query(
      `INSERT INTO user_course_assignments (user_id, course_id)
       VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING`,
      [userId, courseId],
    );
  }

  async revokeAccess(userId: string, accessId: string) {

    if (accessId.startsWith('group:')) return;
    await this.dataSource.query(
      `DELETE FROM user_course_assignments WHERE id = $1 AND user_id = $2`,
      [accessId, userId],
    );
  }
}
