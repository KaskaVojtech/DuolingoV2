/**
 * Management of lesson blocks (content/exercise/mix type): creation, mapping and ordering.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './entities/block.entity';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private readonly blockRepo: Repository<Block>,
  ) {}

  private toResponse(block: Block) {
    return {
      id: block.id,
      lessonId: block.lessonId,
      title: block.title,
      type: block.type,
      order: block.orderIndex,
      isLocked: block.isLocked,
      lockConfig: block.lockConfig,
      contentAttributes: block.contentAttributes,
      exerciseAttributes: block.exerciseAttributes,
      createdAt: block.createdAt.toISOString(),
      updatedAt: block.updatedAt.toISOString(),
    };
  }

  async findById(id: string): Promise<any> {
    const block = await this.blockRepo.findOne({ where: { id } });
    if (!block) throw new NotFoundException(`Block ${id} not found`);
    return this.toResponse(block);
  }

  async findRawById(id: string): Promise<Block> {
    const block = await this.blockRepo.findOne({ where: { id } });
    if (!block) throw new NotFoundException(`Block ${id} not found`);
    return block;
  }

  async update(id: string, patch: any): Promise<any> {
    const block = await this.findRawById(id);
    Object.assign(block, patch);
    const saved = await this.blockRepo.save(block);
    return this.toResponse(saved);
  }

  async delete(id: string): Promise<void> {
    const block = await this.findRawById(id);
    await this.blockRepo.remove(block);
  }

  async create(lessonId: string, type: 'content' | 'exercise' | 'mix', title?: string): Promise<Block> {
    const maxResult = await this.blockRepo
      .createQueryBuilder('b')
      .select('MAX(b.orderIndex)', 'max')
      .where('b.lessonId = :lessonId', { lessonId })
      .getRawOne();

    const maxOrder = maxResult?.max ?? -1;

    const block = this.blockRepo.create({
      lessonId,
      type,
      title: title ?? (type === 'mix' ? 'Mix her' : type === 'exercise' ? 'Nové cvičení' : 'Nový obsah'),
      orderIndex: maxOrder + 1,
    });
    return this.blockRepo.save(block);
  }

  async findByLessonId(lessonId: string): Promise<Block[]> {
    return this.blockRepo.find({
      where: { lessonId },
      order: { orderIndex: 'ASC' },
    });
  }

  async findByLessonIdMapped(lessonId: string): Promise<any[]> {
    const blocks = await this.findByLessonId(lessonId);
    return blocks.map((b) => this.toResponse(b));
  }

  async reorder(lessonId: string, orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.blockRepo.update({ id: orderedIds[i], lessonId }, { orderIndex: i });
    }
  }
}
