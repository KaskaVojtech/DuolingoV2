/**
 * Mix HTTP endpoints: loading/saving games, vocabulary for generation and generating sentences via the LLM.
 */
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { MixEditorService } from './mix-editor.service';
import { VocabularyService } from '../vocabulary/vocabulary.service';
import { MixGenerationService } from './mix-generation.service';

@Controller('lessons')
@UseGuards(JwtAuthGuard, AdminGuard)
export class MixEditorController {
  constructor(
    private readonly mixEditorService: MixEditorService,
    private readonly vocabularyService: VocabularyService,
    private readonly mixGenerationService: MixGenerationService,
  ) {}

  @Get(':lessonId/mix')
  findByLessonId(@Param('lessonId') lessonId: string) {
    return this.mixEditorService.findByLessonId(lessonId);
  }

  @Patch(':lessonId/mix')
  save(@Param('lessonId') lessonId: string, @Body() body: any) {
    return this.mixEditorService.save(lessonId, body);
  }

  @Get(':lessonId/mix/words')
  generationWords(@Param('lessonId') lessonId: string) {
    return this.vocabularyService.getCumulativeWords(lessonId);
  }

  @Post(':lessonId/mix/sentences')
  async generateSentences(
    @Param('lessonId') lessonId: string,
    @Body() body: { kind: 'fill_in' | 'word_order'; count?: number },
  ) {
    const count = body.count ?? 4;
    const sentences =
      body.kind === 'word_order'
        ? await this.mixGenerationService.generateWordOrder(lessonId, count)
        : await this.mixGenerationService.generateFillIn(lessonId, count);
    return { sentences };
  }
}
