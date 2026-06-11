/**
 * HTTP endpoints for managing lesson vocabulary and imports.
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
import { VocabularyService } from './vocabulary.service';

@Controller('vocabulary')
@UseGuards(JwtAuthGuard, AdminGuard)
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get('check-duplicate')
  checkDuplicate(@Query('wordEn') wordEn: string, @Query('wordCs') wordCs: string) {
    return this.vocabularyService.checkDuplicate(wordEn ?? '', wordCs ?? '');
  }

  @Post()
  createWord(@Body() body: any) {
    return this.vocabularyService.createWord(body);
  }

  @Patch(':wordId')
  updateWord(@Param('wordId') wordId: string, @Body() body: any) {
    return this.vocabularyService.updateWord(wordId, body);
  }
}

@Controller('lessons')
@UseGuards(JwtAuthGuard, AdminGuard)
export class LessonVocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get(':lessonId/vocabulary')
  getLessonVocabulary(@Param('lessonId') lessonId: string, @Query() query: any) {
    return this.vocabularyService.getLessonVocabulary(lessonId, {
      searchQuery: query.searchQuery,
      pos: query.pos ?? null,
      importedOnly: query.importedOnly === 'true',
      sortField: query.sortField,
      sortDirection: query.sortDirection,
    });
  }

  @Get(':lessonId/vocabulary/words')
  getLessonVocabularyWords(@Param('lessonId') lessonId: string) {
    return this.vocabularyService.getLessonVocabularyWords(lessonId);
  }

  @Post(':lessonId/vocabulary')
  addWordToLesson(@Param('lessonId') lessonId: string, @Body() body: { vocabularyId: string }) {
    return this.vocabularyService.addWordToLesson(lessonId, body.vocabularyId);
  }

  @Delete(':lessonId/vocabulary/:entryId')
  @HttpCode(204)
  removeWordFromLesson(
    @Param('lessonId') lessonId: string,
    @Param('entryId') entryId: string,
  ) {
    return this.vocabularyService.removeWordFromLesson(lessonId, entryId);
  }

  @Post(':lessonId/vocabulary/import')
  importWords(
    @Param('lessonId') lessonId: string,
    @Body() body: { sourceWordIds: string[]; importedFromLessonId: string },
  ) {
    return this.vocabularyService.importWords(lessonId, body.sourceWordIds ?? [], body.importedFromLessonId);
  }
}
