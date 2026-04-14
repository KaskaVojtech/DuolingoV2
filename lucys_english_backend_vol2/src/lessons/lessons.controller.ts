import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "src/DTOs/lesson/create-lesson.dto";
import { UpdateLessonDto } from "src/DTOs/lesson/update-lesson.dto";
import { Role } from "src/authentication/decorators/role.decorator";
import { RolesGuard } from "src/authentication/guards/roles.guard";
import { UserRole } from "generated/prisma";
import { QueryLessonDto } from "src/DTOs/lesson/query-lesson.dto";
import { CreateVocabularyInLessonDto } from "src/DTOs/vocabulary/create-vocabulary-in-lesson.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Role(UserRole.ADMIN)
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) { }

    @Get()
    findAll(@Query() query: QueryLessonDto) {
        return this.lessonsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.findOne(id);
    }

    @Post(':lessonId/vocabulary/new')
    createAndAddVocabulary(
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Body() dto: CreateVocabularyInLessonDto,
    ) {
        return this.lessonsService.createAndAddVocabulary(lessonId, dto);
    }

    @Post()
    create(@Body() dto: CreateLessonDto) {
        return this.lessonsService.create(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLessonDto) {
        return this.lessonsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.remove(id);
    }

    @Post(':lessonId/vocabulary/:vocabularyId')
    addVocabulary(
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Param('vocabularyId', ParseIntPipe) vocabularyId: number,
    ) {
        return this.lessonsService.addVocabulary(lessonId, vocabularyId);
    }

    @Delete(':lessonId/vocabulary/:vocabularyId')
    removeVocabulary(
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Param('vocabularyId', ParseIntPipe) vocabularyId: number,
    ) {
        return this.lessonsService.removeVocabulary(lessonId, vocabularyId);
    }

    @Get(':lessonId/vocabulary')
    getVocabulary(@Param('lessonId', ParseIntPipe) lessonId: number) {
        return this.lessonsService.getVocabulary(lessonId);
    }
}