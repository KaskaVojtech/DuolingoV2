// admin/courses/courses.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from 'src/DTOs/course/create-course.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { UpdateCourseDto } from 'src/DTOs/course/update-course.dto';
import { Role } from 'src/authentication/decorators/role.decorator';
import { RolesGuard } from 'src/authentication/guards/roles.guard';
import { UserRole } from 'generated/prisma';
import { UpdateLessonOrderDto } from 'src/DTOs/lesson/update-lesson-order.dtp';
import { AddLessonToCourseDto } from 'src/DTOs/lesson/add-lesson-to-course.dto';
import { UnlockLessonDto } from 'src/DTOs/course-lesson/unlock-lesson.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Role(UserRole.ADMIN)
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }


    @Patch(':courseId/lessons/:lessonId/unlock')
    unlockLesson(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Body() dto: UnlockLessonDto,
    ) {
        return this.coursesService.unlockLesson(courseId, lessonId, dto);
    }

    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.coursesService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateCourseDto) {
        return this.coursesService.create(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
        return this.coursesService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.coursesService.remove(id);
    }

    @Post(':courseId/lessons/:lessonId')
    addLesson(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Body() dto: AddLessonToCourseDto,
    ) {
        return this.coursesService.addLesson(courseId, lessonId, dto);
    }

    @Post(':courseId/duplicate')
    duplicate(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Body('title') title: string,
    ) {
        return this.coursesService.duplicate(courseId, title);
    }

    @Delete(':courseId/lessons/:lessonId')
    removeLesson(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Param('lessonId', ParseIntPipe) lessonId: number,
    ) {
        return this.coursesService.removeLesson(courseId, lessonId);
    }

    @Patch(':courseId/lessons/unlock-all')
    unlockAllLessons(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Body() dto: UnlockLessonDto,
    ) {
        return this.coursesService.unlockAllLessons(courseId, dto.isUnlocked);
    }

    @Patch(':courseId/lessons/:lessonId/order')
    updateLessonOrder(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Body() dto: UpdateLessonOrderDto,
    ) {
        return this.coursesService.updateLessonOrder(courseId, lessonId, dto);
    }

    @Get(':courseId/lessons')
    getLessons(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.coursesService.getLessons(courseId);
    }
}