/**
 * TypeORM repository and queries over the users table.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findAll(search: string, page: number, pageSize: number): Promise<{ items: User[]; totalCount: number }> {
    const q = this.repo.createQueryBuilder('u').orderBy('u.created_at', 'DESC');
    if (search) q.where('u.email ILIKE :s', { s: `%${search}%` });
    const totalCount = await q.getCount();
    const items = await q.skip((page - 1) * pageSize).take(pageSize).getMany();
    return { items, totalCount };
  }
}
