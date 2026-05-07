import { Controller, Get, Patch, Post, Delete, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Role } from '../authentication/decorators/role.decorator';
import { UserRole } from '../../generated/prisma';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Role(UserRole.ADMIN)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(@Query('search') search?: string) {
        return this.usersService.findAll(search);
    }

    @Patch(':id/deactivate')
    deactivate(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.deactivateUser(id);
    }

    @Post(':userId/courses/:courseId')
    assignCourse(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('courseId', ParseIntPipe) courseId: number,
    ) {
        return this.usersService.assignCourse(userId, courseId);
    }

    @Delete(':userId/courses/:courseId')
    removeCourse(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('courseId', ParseIntPipe) courseId: number,
    ) {
        return this.usersService.removeCourse(userId, courseId);
    }

}