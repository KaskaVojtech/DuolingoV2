/**
 * Mix editor module (games in a lesson).
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonMix } from './entities/lesson-mix.entity';
import { MixEditorService } from './mix-editor.service';
import { MixGenerationService } from './mix-generation.service';
import { MixEditorController } from './mix-editor.controller';
import { VocabularyModule } from '../vocabulary/vocabulary.module';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [TypeOrmModule.forFeature([LessonMix]), VocabularyModule, LlmModule],
  controllers: [MixEditorController],
  providers: [MixEditorService, MixGenerationService],
  exports: [MixEditorService],
})
export class MixEditorModule {}
