/**
 * HTTP endpoints for user administration (listing, detail, actions).
 */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('search') search: string = '',
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
  ) {
    return this.usersService.findAll(search, parseInt(page, 10), parseInt(pageSize, 10));
  }

  @Get(':id')
  getUserDetail(@Param('id') id: string) {
    return this.usersService.getUserDetail(id);
  }

  @Get(':id/courses')
  getUserCourses(@Param('id') id: string) {
    return this.usersService.getUserCourses(id);
  }

  @Post(':id/courses')
  @HttpCode(204)
  assignCourse(@Param('id') id: string, @Body() body: { courseId: string }) {
    return this.usersService.assignCourse(id, body.courseId);
  }

  @Delete(':id/courses/:accessId')
  @HttpCode(204)
  revokeAccess(@Param('id') id: string, @Param('accessId') accessId: string) {
    return this.usersService.revokeAccess(id, accessId);
  }
}
