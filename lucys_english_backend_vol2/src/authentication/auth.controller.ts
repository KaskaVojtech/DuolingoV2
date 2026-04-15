import { Controller, Post, Get, Query, Body, Req, Res, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/DTOs/user/register-user.dto';
import { LoginDto } from 'src/DTOs/auth/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Req() req: ExpressRequest) {
        return req.user;
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        console.log('registerDto:', registerDto);
        console.log('type:', typeof registerDto.email);
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: ExpressResponse) {
        return this.authService.login(loginDto, res);
    }


    @Post('refresh')
    async refresh(@Req() req: ExpressRequest, @Res({ passthrough: true }) res: ExpressResponse) {
        return this.authService.refresh(req, res);
    }

    @Post('logout')
    async logout(@Req() req: ExpressRequest, @Res({ passthrough: true }) res: ExpressResponse) {
        return this.authService.logout(req, res);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

}