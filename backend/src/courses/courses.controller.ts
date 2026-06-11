/**
 * HTTP endpoints for course management (overview, creation, update, deletion, soft-delete).
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CoursesService } from './courses.service';
import { LessonsService } from '../lessons/lessons.service';

@Controller('courses')
@UseGuards(JwtAuthGuard, AdminGuard)
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly lessonsService: LessonsService,
  ) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.coursesService.create(body);
  }

  @Get('deleted')
  findDeleted(@Query() query: any) {
    return this.coursesService.findDeleted(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() body: any) {
    return this.coursesService.update(id, body);
  }

  @Post(':id/save-as-template')
  saveAsTemplate(@Param('id') id: string, @Body() body: { templateName: string }) {
    return this.coursesService.saveAsTemplate(id, body.templateName);
  }

  @Get(':id/settings')
  getSettings(@Param('id') id: string) {
    return this.coursesService.getSettings(id);
  }

  @Get(':id/lessons')
  getCourseLessons(@Param('id') id: string) {
    return this.lessonsService.findByCourseId(id);
  }

  @Patch(':id/lessons/reorder')
  @HttpCode(204)
  reorderLessons(@Param('id') id: string, @Body() body: { orderedIds: string[] }) {
    return this.lessonsService.reorderInCourse(id, body.orderedIds);
  }

  @Post(':id/lessons')
  createLesson(@Param('id') id: string, @Body() body: { title: string }) {
    return this.lessonsService.create(id, body.title ?? 'Nová lekce');
  }

  @Post(':id/lessons/import-templates')
  importTemplates(
    @Param('id') id: string,
    @Body() body: { templateIds: string[]; afterOrder: number },
  ) {
    return this.lessonsService.importTemplates(id, body.templateIds ?? [], body.afterOrder ?? 0);
  }

  @Get(':id/delete-preview')
  getDeletePreview(@Param('id') id: string) {
    return this.coursesService.getDeletePreview(id);
  }

  @Delete(':id')
  @HttpCode(200)
  deleteCourse(@Param('id') id: string, @Body() body: { preserveLessonIds?: string[] }) {
    return this.coursesService.deleteCourse(id, body.preserveLessonIds ?? []);
  }

  @Post(':id/restore')
  @HttpCode(200)
  restoreCourse(@Param('id') id: string) {
    return this.coursesService.restoreCourse(id);
  }

  @Delete(':id/permanent')
  @HttpCode(200)
  purgeCourse(@Param('id') id: string) {
    return this.coursesService.purgeCourse(id);
  }
}
