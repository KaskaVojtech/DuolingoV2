/**
 * HTTP endpoints for loading and saving an exercise.
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
import { ExercisesService } from './exercises.service';

@Controller('exercises')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.exercisesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  save(@Param('id') id: string, @Body() body: any) {
    return this.exercisesService.save(id, body);
  }
}
