import { BadRequestException, Injectable } from '@nestjs/common';
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

    async findAll(search?: string) {
        return this.postgres.user.findMany({
            where: search ? {
                email: { contains: search, mode: 'insensitive' },
            } : undefined,
            include: {
                userCourses: {
                    include: { course: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async deactivateUser(id: number) {
        return this.postgres.user.update({
            where: { id },
            data: { status: UserStatus.NOTACTIVE } as Prisma.UserUpdateInput,
        });
    }

    async assignCourse(userId: number, courseId: number) {
        const existing = await this.postgres.userCourse.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (existing) throw new BadRequestException('User already has this course');
        return this.postgres.userCourse.create({
            data: { userId, courseId },
        });
    }

    async removeCourse(userId: number, courseId: number) {
        return this.postgres.userCourse.delete({
            where: { userId_courseId: { userId, courseId } },
        });
    }
    async getMyCourses(userId: number) {
        return this.postgres.userCourse.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        courseLessons: {
                            orderBy: { order: 'asc' },
                            include: { lesson: true },
                        },
                    },
                },
            },
        });
    }


}