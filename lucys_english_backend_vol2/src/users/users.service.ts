import { Injectable } from '@nestjs/common';
import { PostgresService } from '../postgres/postgres.service';
import { CreateUserDto } from '../DTOs/user/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserStatus, Prisma } from 'generated/prisma';


@Injectable()
export class UsersService {

    constructor(private readonly postgres: PostgresService) { }

    async createUser(data: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(data.password, 14);

        return this.postgres.user.create({
            data: {
                email: data.email,
                passHash: hashedPassword,
            },
        });
    }

    async findByEmail(email: string) {
        return this.postgres.user.findUnique({
            where: { email }
        });
    }

    async activateUser(id: number) {
        return this.postgres.user.update({
            where: { id },
            data: { status: UserStatus.ACTIVE } as Prisma.UserUpdateInput,
        });
    }

    async deletePendingOlderThan(hours: number) {
        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
        return this.postgres.user.deleteMany({
            where: {
                status: UserStatus.PENDING,
                createdAt: { lt: cutoff },
            },
        });
    }

}