/**
 * HTTP endpoints for individual blocks (detail, update, deletion).
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BlocksService } from './blocks.service';

@Controller('blocks')
@UseGuards(JwtAuthGuard, AdminGuard)
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.blocksService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.blocksService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.blocksService.delete(id);
  }
}
