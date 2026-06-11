/**
 * HTTP endpoints for a lesson's practice configuration (enabled types, regeneration).
 */
import { Body, Controller, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { PracticeService } from './practice.service';
import { UpdatePracticeConfigDto, UpdatePracticeTypeDto } from './dto/practice.dto';

@Controller('lessons/:id/practice')
@UseGuards(JwtAuthGuard, AdminGuard)
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Get('config')
  getConfig(@Param('id') lessonId: string) {
    return this.practiceService.getConfig(lessonId);
  }

  @Patch('config')
  @HttpCode(204)
  updateConfig(@Param('id') lessonId: string, @Body() dto: UpdatePracticeConfigDto) {
    return this.practiceService.updateConfig(lessonId, dto);
  }

  @Patch('types/:type')
  @HttpCode(204)
  updateType(
    @Param('id') lessonId: string,
    @Param('type') type: string,
    @Body() dto: UpdatePracticeTypeDto,
  ) {
    return this.practiceService.updateType(lessonId, type, dto.isEnabled);
  }

  @Post('regenerate')
  @HttpCode(202)
  regenerate(@Param('id') lessonId: string) {
    return this.practiceService.regenerate(lessonId);
  }
}
