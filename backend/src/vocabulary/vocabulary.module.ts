/**
 * Vocabulary module.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularyWord } from './entities/vocabulary-word.entity';
import { LessonVocabulary } from './entities/lesson-vocabulary.entity';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController, LessonVocabularyController } from './vocabulary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VocabularyWord, LessonVocabulary])],
  controllers: [VocabularyController, LessonVocabularyController],
  providers: [VocabularyService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
