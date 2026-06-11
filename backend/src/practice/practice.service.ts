/**
 * Lesson practice configuration: enabled exercise types and their state.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonPracticeConfig } from './entities/lesson-practice-config.entity';
import { LessonPracticeType } from './entities/lesson-practice-type.entity';
import { PracticeExercise } from './entities/practice-exercise.entity';

const PRACTICE_TYPES = [
  'vocab_multiple_choice', 'vocab_translation', 'vocab_memory', 'vocab_drag', 'vocab_spelling',
  'sent_fill_in', 'sent_word_order', 'sent_translation',
  'listen_multiple_choice', 'listen_write',
];

@Injectable()
export class PracticeService {
  constructor(
    @InjectRepository(LessonPracticeConfig)
    private readonly configRepo: Repository<LessonPracticeConfig>,
    @InjectRepository(LessonPracticeType)
    private readonly typeRepo: Repository<LessonPracticeType>,
    @InjectRepository(PracticeExercise)
    private readonly exerciseRepo: Repository<PracticeExercise>,
  ) {}

  async getConfig(lessonId: string) {
    let config = await this.configRepo.findOne({ where: { lessonId } });
    if (!config) {
      config = this.configRepo.create({ lessonId, isPracticeEnabled: true, lastGeneratedAt: null });
      await this.configRepo.save(config);
    }

    let typeRows = await this.typeRepo.find({ where: { lessonId } });
    if (typeRows.length === 0) {
      typeRows = PRACTICE_TYPES.map((type) =>
        this.typeRepo.create({ lessonId, type, isEnabled: true })
      );
      await this.typeRepo.save(typeRows);
    }

    return {
      lessonId,
      isPracticeEnabled: config.isPracticeEnabled,
      lastGeneratedAt: config.lastGeneratedAt?.toISOString() ?? null,
      types: typeRows.map((t) => ({
        type: t.type,
        isEnabled: t.isEnabled,
        isAvailable: true,
        unavailableReason: null,
      })),
      wordCount: 0,
      wordsWithAudio: 0,
      wordsWithSentences: 0,
    };
  }

  async updateConfig(lessonId: string, patch: { isPracticeEnabled?: boolean }) {
    let config = await this.configRepo.findOne({ where: { lessonId } });
    if (!config) {
      config = this.configRepo.create({ lessonId });
    }
    if (patch.isPracticeEnabled !== undefined) {
      config.isPracticeEnabled = patch.isPracticeEnabled;
    }
    await this.configRepo.save(config);
  }

  async updateType(lessonId: string, type: string, isEnabled: boolean) {
    let row = await this.typeRepo.findOne({ where: { lessonId, type } });
    if (!row) {
      row = this.typeRepo.create({ lessonId, type, isEnabled });
    } else {
      row.isEnabled = isEnabled;
    }
    await this.typeRepo.save(row);
  }

  async regenerate(lessonId: string) {
    await this.exerciseRepo.delete({ lessonId });
    const config = await this.configRepo.findOne({ where: { lessonId } });
    if (config) {
      config.lastGeneratedAt = new Date();
      await this.configRepo.save(config);
    }
  }
}
