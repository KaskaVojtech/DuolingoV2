/**
 * HTTP endpoints for managing groups and their links to courses and users.
 */
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { GroupsService } from './groups.service';

@Controller('groups')
@UseGuards(JwtAuthGuard, AdminGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; color?: string }) {
    return this.groupsService.create(body.name, body.color ?? '#4f6ef7');
  }

  @Get('users/search')
  searchUsers(@Query('q') q: string) {
    return this.groupsService.searchUsers(q ?? '');
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.groupsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() body: { name?: string; color?: string }) {
    return this.groupsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.groupsService.delete(id);
  }

  @Post(':id/members')
  @HttpCode(204)
  addMember(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.groupsService.addMember(id, body.userId);
  }

  @Delete(':id/members/:userId')
  @HttpCode(204)
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.groupsService.removeMember(id, userId);
  }

  @Get(':id/courses')
  getGroupCourses(@Param('id') id: string) {
    return this.groupsService.getGroupCourses(id);
  }

  @Post(':id/courses')
  @HttpCode(204)
  assignCourse(@Param('id') id: string, @Body() body: { courseId: string }) {
    return this.groupsService.assignCourse(id, body.courseId);
  }

  @Delete(':id/courses/:courseId')
  @HttpCode(204)
  unassignCourse(@Param('id') id: string, @Param('courseId') courseId: string) {
    return this.groupsService.unassignCourse(id, courseId);
  }
}
