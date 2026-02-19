import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  Body,
  HttpCode,
} from '@nestjs/common';
import type { Request, Response, CookieOptions } from 'express';
import { AuthService } from './auth.service';


class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {

    constructor(private readonly auth: AuthService) {}

    private readonly isProduction = process.env.NODE_ENV === 'production';
    private readonly REFRESH_TTL_SECONDS = 60 * 60 * 24;
    private readonly REFRESH_COOKIE_NAME = 'refresh_token';



// ============================================
// POST
// ============================================

    @Post('login/email')
    @HttpCode(200)
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const refreshToken = await this.auth.loginWithEmail(
        body.email,
        body.password,
        this.REFRESH_TTL_SECONDS,
        );

        this.setRefreshCookie(res, refreshToken);

        return { ok: true };
    }

    @Post('verify')
    @HttpCode(200)
    async verify(@Req() req: Request) {
        const token = req.cookies?.[this.REFRESH_COOKIE_NAME];
        if (!token) throw new UnauthorizedException('Missing refresh token cookie');

        const userId = await this.auth.verifyRefreshToken(token);
        return { userId };
    }

    @Post('refresh')
    @HttpCode(200)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const token = req.cookies?.[this.REFRESH_COOKIE_NAME];
        if (!token) throw new UnauthorizedException('Missing refresh token cookie');

        const { refreshToken: newToken } = await this.auth.refreshRefreshToken(
        token,
        this.REFRESH_TTL_SECONDS,
        );

        this.setRefreshCookie(res, newToken);
        return { ok: true };
    }

    @Post('logout')
    @HttpCode(204)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[this.REFRESH_COOKIE_NAME];
    if (token) await this.auth.logout(token);

    this.clearRefreshCookie(res);
    }

// ============================================
// HELPER METHODS
// ============================================

    private refreshCookieOptions(): CookieOptions {
        return {
            httpOnly: true,
            sameSite: this.isProduction ? 'none' : 'lax',
            secure: this.isProduction,
            path: '/auth',
            maxAge: this.REFRESH_TTL_SECONDS * 1000,
        };
    }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie(this.REFRESH_COOKIE_NAME, token, this.refreshCookieOptions());
  }

    private clearRefreshCookie(res: Response) {
    res.clearCookie(this.REFRESH_COOKIE_NAME, this.refreshCookieOptions());
    }
}


