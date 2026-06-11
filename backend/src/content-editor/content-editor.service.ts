/**
 * Saving and loading content blocks (text, media, tables) stored as JSON.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockContent } from './entities/block-content.entity';
import { BlocksService } from '../blocks/blocks.service';

@Injectable()
export class ContentEditorService {
  constructor(
    @InjectRepository(BlockContent)
    private readonly contentRepo: Repository<BlockContent>,
    private readonly blocksService: BlocksService,
  ) {}

  async findByBlockId(blockId: string): Promise<BlockContent> {
    const content = await this.contentRepo.findOne({ where: { id: blockId } });
    if (!content) throw new NotFoundException(`BlockContent ${blockId} not found`);
    return content;
  }

  async create(lessonId: string): Promise<BlockContent> {
    const block = await this.blocksService.create(lessonId, 'content', 'Nový obsah');
    const content = this.contentRepo.create({
      id: block.id,
      lessonId,
      title: 'Nový obsah',
      blocks: [],
    });
    return this.contentRepo.save(content);
  }

  async save(id: string, data: any): Promise<void> {
    const content = await this.findByBlockId(id);
    if (data.title !== undefined) content.title = data.title;
    if (data.blocks !== undefined) content.blocks = data.blocks;
    await this.contentRepo.save(content);
  }
}
