/**
 * Content blocks editor module.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockContent } from './entities/block-content.entity';
import { ContentEditorService } from './content-editor.service';
import { ContentEditorController } from './content-editor.controller';
import { BlocksModule } from '../blocks/blocks.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlockContent]), BlocksModule],
  controllers: [ContentEditorController],
  providers: [ContentEditorService],
  exports: [ContentEditorService],
})
export class ContentEditorModule {}
