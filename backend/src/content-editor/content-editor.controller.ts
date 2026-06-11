/**
 * HTTP endpoints for loading and saving block content.
 */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ContentEditorService } from './content-editor.service';

@Controller('block-contents')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ContentEditorController {
  constructor(private readonly contentEditorService: ContentEditorService) {}

  @Get(':id')
  findByBlockId(@Param('id') id: string) {
    return this.contentEditorService.findByBlockId(id);
  }

  @Patch(':id')
  @HttpCode(204)
  save(@Param('id') id: string, @Body() body: any) {
    return this.contentEditorService.save(id, body);
  }
}
