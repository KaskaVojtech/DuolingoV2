/**
 * Loading and saving a lesson's game mix (sequence of games and their variants).
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonMix } from './entities/lesson-mix.entity';

@Injectable()
export class MixEditorService {
  constructor(
    @InjectRepository(LessonMix)
    private readonly mixRepo: Repository<LessonMix>,
  ) {}

  async findByLessonId(lessonId: string): Promise<LessonMix> {
    let mix = await this.mixRepo.findOne({ where: { lessonId } });
    if (!mix) {
      mix = this.mixRepo.create({ lessonId, games: [], isRandomOrder: false, xp: 0 });
      mix = await this.mixRepo.save(mix);
    }
    return mix;
  }

  async save(lessonId: string, data: any): Promise<LessonMix> {
    let mix = await this.mixRepo.findOne({ where: { lessonId } });
    if (!mix) {
      mix = this.mixRepo.create({ lessonId, games: [], isRandomOrder: false, xp: 0 });
    }
    if (data.games !== undefined) mix.games = data.games;
    if (data.isRandomOrder !== undefined) mix.isRandomOrder = data.isRandomOrder;
    if (data.xp !== undefined) mix.xp = data.xp;
    return this.mixRepo.save(mix);
  }
}
