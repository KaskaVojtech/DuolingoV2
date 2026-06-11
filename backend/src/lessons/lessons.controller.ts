/**
 * Lesson HTTP endpoints: overview, detail, blocks, locks, statistics and creation of content/exercise/mix.
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
import { LessonsService } from './lessons.service';
import { ExercisesService } from '../exercises/exercises.service';
import { ContentEditorService } from '../content-editor/content-editor.service';

@Controller('lessons')
@UseGuards(JwtAuthGuard, AdminGuard)
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly exercisesService: ExercisesService,
    private readonly contentEditorService: ContentEditorService,
  ) {}

  @Get()
  findAll(@Query() query: any) {
    return this.lessonsService.findAll({
      searchQuery: query.searchQuery,
      courseId: query.courseId,
      isTemplate: query.isTemplate !== undefined ? query.isTemplate === 'true' : null,
      isLocked: query.isLocked !== undefined ? query.isLocked === 'true' : null,
      sortField: query.sortField,
      sortDirection: query.sortDirection,
      page: query.page ? parseInt(query.page, 10) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : 20,
    });
  }

  @Get('templates')
  findTemplates() {
    return this.lessonsService.findTemplates();
  }

  @Get('for-import')
  findForImport(@Query('excludeLessonId') excludeLessonId: string) {
    return this.lessonsService.findForImport(excludeLessonId ?? '');
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.lessonsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.lessonsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.lessonsService.delete(id);
  }

  @Post(':id/save-as-template')
  saveAsTemplate(@Param('id') id: string, @Body() body: { templateName?: string }) {
    return this.lessonsService.saveAsTemplate(id, body.templateName);
  }

  @Get(':id/blocks')
  getBlocks(@Param('id') id: string) {
    return this.lessonsService.getBlocks(id);
  }

  @Patch(':id/blocks/reorder')
  @HttpCode(204)
  reorderBlocks(@Param('id') id: string, @Body() body: { orderedIds: string[] }) {
    return this.lessonsService.reorderBlocks(id, body.orderedIds);
  }

  @Get(':id/info')
  getInfo(@Param('id') id: string) {
    return this.lessonsService.getInfo(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.lessonsService.getStats(id);
  }

  @Patch(':id/lock')
  @HttpCode(204)
  updateLock(@Param('id') id: string, @Body() body: any) {
    return this.lessonsService.updateLock(id, body);
  }

  @Get(':id/users')
  getUsers(
    @Param('id') id: string,
    @Query('minPercent') minPercent: string,
    @Query('maxPercent') maxPercent: string,
  ) {
    return this.lessonsService.getUsers(id, parseFloat(minPercent) || 0, parseFloat(maxPercent) || 100);
  }

  @Post(':id/exercises')
  async createExercise(@Param('id') id: string) {
    const effectiveId = await this.lessonsService.resolveTemplateId(id);
    return this.exercisesService.create(effectiveId);
  }

  @Post(':id/block-contents')
  async createBlockContent(@Param('id') id: string) {
    const effectiveId = await this.lessonsService.resolveTemplateId(id);
    return this.contentEditorService.create(effectiveId);
  }

  @Post(':id/mix-blocks')
  createMixBlock(@Param('id') id: string, @Body() body: { title?: string }) {
    return this.lessonsService.createMixBlock(id, body.title);
  }
}
