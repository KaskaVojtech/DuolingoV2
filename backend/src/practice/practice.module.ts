/**
 * Practice module.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonPracticeConfig } from './entities/lesson-practice-config.entity';
import { LessonPracticeType } from './entities/lesson-practice-type.entity';
import { PracticeExercise } from './entities/practice-exercise.entity';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonPracticeConfig, LessonPracticeType, PracticeExercise]),
  ],
  controllers: [PracticeController],
  providers: [PracticeService],
})
export class PracticeModule {}
