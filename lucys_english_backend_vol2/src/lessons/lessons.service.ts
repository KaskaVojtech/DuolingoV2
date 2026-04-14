import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { LessonType, Prisma } from "generated/prisma";
import { CreateLessonDto } from "src/DTOs/lesson/create-lesson.dto";
import { CreateVocabularyInLessonDto } from "src/DTOs/vocabulary/create-vocabulary-in-lesson.dto";
import { QueryLessonDto } from "src/DTOs/lesson/query-lesson.dto";
import { UpdateLessonDto } from "src/DTOs/lesson/update-lesson.dto";
import { PostgresService } from "src/postgres/postgres.service";

@Injectable()
export class LessonsService {
    constructor(private readonly postgres: PostgresService) { }

    async findAll(query: QueryLessonDto) {
        const { search, type, courseId } = query;

        return this.postgres.lesson.findMany({
            where: {
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                }),
                ...(type && { type: type as LessonType }),
                ...(courseId && {
                    courseLessons: {
                        some: { courseId: Number(courseId) },
                    },
                }),
            },
            include: {
                lessonVocabulary: {
                    include: { vocabulary: true },
                },
            },
        });
    }

    async createAndAddVocabulary(lessonId: number, dto: CreateVocabularyInLessonDto) {
        await this.findOne(lessonId);

        return this.postgres.$transaction(async (tx) => {
            const vocabulary = await tx.vocabulary.create({ data: dto });
            await tx.lessonVocabulary.create({
                data: { lessonId, vocabularyId: vocabulary.id },
            });
            return vocabulary;
        });
    }

    async findOne(id: number) {
        const lesson = await this.postgres.lesson.findUnique({
            where: { id },
            include: {
                lessonVocabulary: {
                    include: { vocabulary: true },
                },
            },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');
        return lesson;
    }

    async create(dto: CreateLessonDto) {
        return this.postgres.lesson.create({
            data: dto as Prisma.LessonUncheckedCreateInput,
        });
    }

    async update(id: number, dto: UpdateLessonDto) {
        await this.findOne(id);
        return this.postgres.lesson.update({ where: { id }, data: dto });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.postgres.lesson.delete({ where: { id } });
    }

    async addVocabulary(lessonId: number, vocabularyId: number) {
        await this.findOne(lessonId);

        const vocabulary = await this.postgres.vocabulary.findUnique({ where: { id: vocabularyId } });
        if (!vocabulary) throw new NotFoundException('Vocabulary not found');

        const existing = await this.postgres.lessonVocabulary.findUnique({
            where: { lessonId_vocabularyId: { lessonId, vocabularyId } },
        });
        if (existing) throw new BadRequestException('Vocabulary already in lesson');

        return this.postgres.lessonVocabulary.create({
            data: { lessonId, vocabularyId },
        });
    }

    async removeVocabulary(lessonId: number, vocabularyId: number) {
        await this.findOne(lessonId);
        const existing = await this.postgres.lessonVocabulary.findUnique({
            where: { lessonId_vocabularyId: { lessonId, vocabularyId } },
        });
        if (!existing) throw new NotFoundException('Vocabulary not in lesson');

        return this.postgres.lessonVocabulary.delete({
            where: { lessonId_vocabularyId: { lessonId, vocabularyId } },
        });
    }

    async getVocabulary(lessonId: number) {
        await this.findOne(lessonId);
        return this.postgres.lessonVocabulary.findMany({
            where: { lessonId },
            include: { vocabulary: true },
        });
    }
}