/**
 * HTTP endpoints for login, registration, refresh and logout (admin and user); sets and clears httpOnly refresh cookies.
 */
import { Controller, Post, Body, Req, Res, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

const REFRESH_COOKIE = 'refreshToken';
const USER_REFRESH_COOKIE = 'userRefreshToken';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const tokens = await this.authService.login(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (!refreshToken) throw new UnauthorizedException();
    const tokens = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    await this.authService.logout(refreshToken ?? '');
    res.clearCookie(REFRESH_COOKIE, { path: '/auth' });
    return { ok: true };
  }

  @Post('check-email')
  @HttpCode(200)
  checkEmail(@Body() body: { email: string }) {
    return this.authService.checkEmail(body.email);
  }

  @Post('check-code')
  @HttpCode(200)
  checkCode(@Body() body: { code: string }) {
    return this.authService.checkCode(body.code);
  }

  @Post('register')
  @HttpCode(200)
  async register(@Body() body: { email: string; password: string; source: 'email' | 'code'; code?: string }, @Res({ passthrough: true }) res: any) {
    const tokens = await this.authService.register(body.email, body.password, body.source, body.code);
    this.setUserRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('user-login')
  @HttpCode(200)
  async userLogin(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const tokens = await this.authService.userLogin(dto);
    this.setUserRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('user-refresh')
  @HttpCode(200)
  async userRefresh(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.[USER_REFRESH_COOKIE];
    if (!refreshToken) throw new UnauthorizedException();
    const tokens = await this.authService.userRefresh(refreshToken);
    this.setUserRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('user-logout')
  @HttpCode(200)
  async userLogout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const refreshToken = req.cookies?.[USER_REFRESH_COOKIE];
    await this.authService.userLogout(refreshToken ?? '');
    res.clearCookie(USER_REFRESH_COOKIE, { path: '/auth' });
    return { ok: true };
  }

  private setRefreshCookie(res: any, token: string) {
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/auth',
    });
  }

  private setUserRefreshCookie(res: any, token: string) {
    res.cookie(USER_REFRESH_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/auth',
    });
  }
}
