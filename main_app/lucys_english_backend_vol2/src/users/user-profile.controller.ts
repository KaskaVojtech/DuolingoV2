import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class UserProfileController {
    constructor(private readonly usersService: UsersService) { }

    @Get('courses')
    getMyCourses(@Req() req: ExpressRequest) {
        return this.usersService.getMyCourses((req.user as any).id);
    }
}