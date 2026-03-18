import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { EmailPasswordStrategy } from "./auth-strategies/email-password-strategy.service";
import { AccessCodeStrategy } from "./auth-strategies/access-code-strategy.service";
import { EmailPasswordDto } from "./dtos/email-password-dto";
import { AuthResponseDTO } from "./dtos/auth-response-dto";
import { AccessCodeDto } from "./dtos/access-code-dto";
import { AccessTokenGuard } from "./access-token.guard";
import { RegisterEmailPasswordDto } from "src/users/dtos/register-email-password-dto";
import { AccessCodeRegisterStrategy } from "src/users/register-strategies/access-code-register-strategy.service";
import { EmailPasswordRegisterStrategy } from "src/users/register-strategies/email-password-register-strategy.service";
import type { Request, Response } from 'express'; 

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly emailPasswordStrategy: EmailPasswordStrategy,
        private readonly accessCodeStrategy: AccessCodeStrategy,
        private readonly emailPasswordRegisterStrategy: EmailPasswordRegisterStrategy,
        private readonly accessCodeRegisterStrategy: AccessCodeRegisterStrategy,
    ) {}

    // ============================================
    // POST
    // ============================================

    @Post('login/email')
    async loginEmail(
        @Body() credentials: EmailPasswordDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const tokens = await this.authService.login(this.emailPasswordStrategy, credentials);
        this.setTokenCookies(res, tokens);
    }

    @Post('login/code')
    async loginCode(
        @Body() credentials: AccessCodeDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const tokens = await this.authService.login(this.accessCodeStrategy, credentials);
        this.setTokenCookies(res, tokens);
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const token = req.cookies?.refresh_token;
        res.clearCookie('access_token');
        res.clearCookie('refresh_token', { path: '/auth/refresh' });
        if (token) await this.authService.logout(token);
    }

    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const refreshToken = req.cookies?.refresh_token; 
        const tokens = await this.authService.refresh(refreshToken);
        this.setTokenCookies(res, tokens);
    }

    @Post('register/email')
    async registerEmail(
        @Body() credentials: RegisterEmailPasswordDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const tokens = await this.authService.register(this.emailPasswordRegisterStrategy, credentials);
        this.setTokenCookies(res, tokens);
    }

    @Post('register/code')
    async registerCode(
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const tokens = await this.authService.register(this.accessCodeRegisterStrategy, undefined);
        this.setTokenCookies(res, tokens);
    }
    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        if (!token) throw new BadRequestException('Token chybí.');
        await this.authService.verifyEmail(token);
        return { message: 'Účet byl úspěšně aktivován.' };
    }


    private setTokenCookies(res: Response, tokens: AuthResponseDTO): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        domain: isProduction ? process.env.DOMAIN : undefined,
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/auth/refresh',
    });
    }
}