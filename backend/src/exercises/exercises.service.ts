/**
 * Management of exercises and their items (stored as JSON) including XP and instructions.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { BlocksService } from '../blocks/blocks.service';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    private readonly blocksService: BlocksService,
  ) {}

  async findById(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepo.findOne({ where: { id } });
    if (!exercise) throw new NotFoundException(`Exercise ${id} not found`);
    return exercise;
  }

  async create(lessonId: string): Promise<Exercise> {
    const block = await this.blocksService.create(lessonId, 'exercise', 'Nové cvičení');
    const exercise = this.exerciseRepo.create({
      id: block.id,
      lessonId,
      title: 'Nové cvičení',
      instructions: null,
      xp: 10,
      items: [],
    });
    return this.exerciseRepo.save(exercise);
  }

  async save(id: string, data: any): Promise<void> {
    const exercise = await this.findById(id);
    if (data.title !== undefined) exercise.title = data.title;
    if (data.instructions !== undefined) exercise.instructions = data.instructions;
    if (data.xp !== undefined) exercise.xp = data.xp;
    if (data.items !== undefined) exercise.items = data.items;
    await this.exerciseRepo.save(exercise);
  }
}
