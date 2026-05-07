import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostgresService } from '../postgres/postgres.service';
import { CreateAccessCodeDto } from 'src/DTOs/access-codes/create-access-code.dto';
import { RedeemAccessCodeDto } from 'src/DTOs/access-codes/redeem-access-code';
import { AccessCodeStatus } from '../../generated/prisma';

const CODE_MIN_LENGTH = 6;

@Injectable()
export class AccessCodesService {
    constructor(private readonly postgres: PostgresService) { }

    async findAll() {
        return this.postgres.accessCode.findMany({
            include: {
                codeCourses: { include: { course: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(dto: CreateAccessCodeDto) {
        const code = dto.code ? dto.code.trim() : this.generateCode();

        if (code.length < CODE_MIN_LENGTH) {
            throw new BadRequestException(`Code must be at least ${CODE_MIN_LENGTH} characters long`);
        }

        const existing = await this.postgres.accessCode.findUnique({ where: { code } });
        if (existing) throw new BadRequestException('Code already exists');

        if (!dto.courseIds || dto.courseIds.length === 0) {
            throw new BadRequestException('At least one course is required');
        }

        return this.postgres.accessCode.create({
            data: {
                code,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
                codeCourses: {
                    create: dto.courseIds.map((courseId) => ({ courseId })),
                },
            },
            include: {
                codeCourses: { include: { course: true } },
            },
        });
    }

    async redeem(userId: number, dto: RedeemAccessCodeDto) {
        const accessCode = await this.postgres.accessCode.findUnique({
            where: { code: dto.code.trim() },
            include: {
                codeCourses: true,
            },
        });

        if (!accessCode) throw new NotFoundException('Invalid code');

        if (accessCode.status === AccessCodeStatus.USED) {
            throw new BadRequestException('Code has already been used');
        }

        if (accessCode.status === AccessCodeStatus.EXPIRED) {
            throw new BadRequestException('Code has expired');
        }

        if (accessCode.expiresAt && new Date() > accessCode.expiresAt) {
            await this.postgres.accessCode.update({
                where: { id: accessCode.id },
                data: { status: AccessCodeStatus.EXPIRED },
            });
            throw new BadRequestException('Code has expired');
        }

        const courseIds = accessCode.codeCourses.map((cc) => cc.courseId);

        await this.postgres.$transaction(async (tx) => {
            for (const courseId of courseIds) {
                const exists = await tx.userCourse.findUnique({
                    where: { userId_courseId: { userId, courseId } },
                });
                if (!exists) {
                    await tx.userCourse.create({ data: { userId, courseId } });
                }
            }

            await tx.accessCode.update({
                where: { id: accessCode.id },
                data: {
                    status: AccessCodeStatus.USED,
                    usedAt: new Date(),
                    usedById: userId,
                },
            });
        });

        return {
            message: 'Code redeemed successfully',
            coursesAdded: courseIds.length,
        };
    }

    async remove(id: number) {
        const existing = await this.postgres.accessCode.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException('Code not found');
        return this.postgres.accessCode.delete({ where: { id } });
    }

    private generateCode(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length: 8 }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    }
}