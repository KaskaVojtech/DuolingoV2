import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UnlockLessonDto } from "src/DTOs/course-lesson/unlock-lesson.dto";
import { CreateCourseDto } from "src/DTOs/course/create-course.dto";
import { UpdateCourseDto } from "src/DTOs/course/update-course.dto";
import { AddLessonToCourseDto } from "src/DTOs/lesson/add-lesson-to-course.dto";
import { UpdateLessonOrderDto } from "src/DTOs/lesson/update-lesson-order.dtp";
import { PostgresService } from "src/postgres/postgres.service";

@Injectable()
export class CoursesService {
    constructor(private readonly postgres: PostgresService) { }

    async findAll() {
        return this.postgres.course.findMany({
            include: {
                courseLessons: {
                    orderBy: { order: 'asc' },
                    include: { lesson: true },
                },
            },
        });
    }

    async findOne(id: number) {
        const course = await this.postgres.course.findUnique({
            where: { id },
            include: {
                courseLessons: {
                    orderBy: { order: 'asc' },
                    include: { lesson: true },
                },
            },
        });
        if (!course) throw new NotFoundException('Course not found');
        return course;
    }

    async create(dto: CreateCourseDto) {
        return this.postgres.course.create({ data: dto });
    }

    async update(id: number, dto: UpdateCourseDto) {
        await this.findOne(id);
        return this.postgres.course.update({ where: { id }, data: dto });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.postgres.course.delete({ where: { id } });
    }

    async addLesson(courseId: number, lessonId: number, dto: AddLessonToCourseDto) {
        await this.findOne(courseId);

        const lesson = await this.postgres.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson) throw new NotFoundException('Lesson not found');

        const existing = await this.postgres.courseLesson.findUnique({
            where: { courseId_lessonId: { courseId, lessonId } },
        });
        if (existing) throw new BadRequestException('Lesson already in course');

        return this.postgres.courseLesson.create({
            data: { courseId, lessonId, order: dto.order },
        });
    }

    async removeLesson(courseId: number, lessonId: number) {
        await this.findOne(courseId);
        const existing = await this.postgres.courseLesson.findUnique({
            where: { courseId_lessonId: { courseId, lessonId } },
        });
        if (!existing) throw new NotFoundException('Lesson not in course');

        return this.postgres.courseLesson.delete({
            where: { courseId_lessonId: { courseId, lessonId } },
        });
    }

    async updateLessonOrder(courseId: number, lessonId: number, dto: UpdateLessonOrderDto) {
        const existing = await this.postgres.courseLesson.findUnique({
            where: { courseId_lessonId: { courseId, lessonId } },
        });
        if (!existing) throw new NotFoundException('Lesson not in course');

        return this.postgres.courseLesson.update({
            where: { courseId_lessonId: { courseId, lessonId } },
            data: { order: dto.order },
        });
    }

    async getLessons(courseId: number) {
        await this.findOne(courseId);
        return this.postgres.courseLesson.findMany({
            where: { courseId },
            orderBy: { order: 'asc' },
            include: { lesson: true },
        });
    }

    async unlockLesson(courseId: number, lessonId: number, dto: UnlockLessonDto) {
        const existing = await this.postgres.courseLesson.findUnique({
            where: { courseId_lessonId: { courseId, lessonId } },
        });
        if (!existing) throw new NotFoundException('Lesson not in course');

        return this.postgres.courseLesson.update({
            where: { courseId_lessonId: { courseId, lessonId } },
            data: { isUnlocked: dto.isUnlocked },
        });
    }

    async unlockAllLessons(courseId: number, isUnlocked: boolean) {
        await this.findOne(courseId);
        return this.postgres.courseLesson.updateMany({
            where: { courseId },
            data: { isUnlocked },
        });
    }

    async duplicate(courseId: number, newTitle: string) {
        const original = await this.findOne(courseId);

        return this.postgres.$transaction(async (tx) => {
            const newCourse = await tx.course.create({
                data: {
                    title: newTitle || `${original.title} (kopie)`,
                    description: original.description,
                },
            });

            if (original.courseLessons.length > 0) {
                await tx.courseLesson.createMany({
                    data: original.courseLessons.map((cl) => ({
                        courseId: newCourse.id,
                        lessonId: cl.lessonId,
                        order: cl.order,
                        isUnlocked: false,
                    })),
                });
            }

            return newCourse;
        });
    }
}