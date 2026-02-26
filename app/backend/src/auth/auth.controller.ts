import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
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
        async loginEmail(@Body() credentials: EmailPasswordDto): Promise<AuthResponseDTO> {
        return this.authService.login(this.emailPasswordStrategy, credentials);
    }

    @Post('login/code')
        async loginCode(@Body() credentials: AccessCodeDto): Promise<AuthResponseDTO> {
        return this.authService.login(this.accessCodeStrategy, credentials);
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
        async logout(@Req() req): Promise<void> {
        const token = req.headers.authorization.split(' ')[1];
        return this.authService.logout(token);
    }

    @Post('refresh')
        async refresh(@Body() body: { refreshToken: string }): Promise<AuthResponseDTO> {
        return this.authService.refresh(body.refreshToken);
    }

    @Post('register/email')
    async registerEmail(@Body() credentials: RegisterEmailPasswordDto): Promise<AuthResponseDTO> {
    return this.authService.register(this.emailPasswordRegisterStrategy, credentials);
    }

    @Post('register/code')
    async registerCode(): Promise<AuthResponseDTO> {
    return this.authService.register(this.accessCodeRegisterStrategy, undefined);
    }
}