/**
 * Lesson management module.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { BlocksModule } from '../blocks/blocks.module';
import { ExercisesModule } from '../exercises/exercises.module';
import { ContentEditorModule } from '../content-editor/content-editor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    BlocksModule,
    ExercisesModule,
    ContentEditorModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
