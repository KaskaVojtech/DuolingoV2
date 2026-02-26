import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IAuthStrategy } from './interfaces/IAuthStrategy';
import type { IAccessTokenService, IRefreshTokenService } from './interfaces/ITokenService';
import { AuthResponseDTO } from './dtos/auth-response-dto';
import { IAuthService } from './interfaces/IAuthService';
import { IRegisterStrategy } from 'src/users/interfaces/IRegisterStrategy';

@Injectable()
export class AuthService implements IAuthService {

    readonly ACCESS_TOKEN_TTL = 900; //15min
    readonly REFRESH_TOKEN_TTL = 2592000; //30d

    constructor(
    @Inject('IRefreshTokenService') private readonly refreshTokenService: IRefreshTokenService,
    @Inject('IAccessTokenService') private readonly accessTokenService: IAccessTokenService,
    ){}

    // ============================================
    // MAIN METHODS
    // ============================================

    async login<T>(strategy: IAuthStrategy<T>, credentials: T): Promise<AuthResponseDTO> {
        const user = await strategy.authenticate(credentials);
  
        const accessToken = await this.accessTokenService.createAccessToken(user.id, this.ACCESS_TOKEN_TTL); 
        const refreshToken = await this.refreshTokenService.createRefreshToken(user.id, this.REFRESH_TOKEN_TTL);
        
        return { accessToken, refreshToken };
    }
    
    async logout(rawToken: string): Promise<void> {
        await this.refreshTokenService.deleteRefreshToken(rawToken);
    }

    async refresh(rawRefreshToken: string): Promise<AuthResponseDTO> {
        const isValid = await this.refreshTokenService.verifyRefreshToken(rawRefreshToken);
        if (!isValid) throw new UnauthorizedException('Invalid or expired refresh token');
        
        const userId = await this.refreshTokenService.getIdFromRefreshToken(rawRefreshToken);
        const newAccessToken = await this.accessTokenService.createAccessToken(userId, this.ACCESS_TOKEN_TTL);
        
        return { accessToken: newAccessToken, refreshToken: rawRefreshToken }; 
    }

    async register<T>(strategy: IRegisterStrategy<T>, credentials: T): Promise<AuthResponseDTO> {
        const user = await strategy.register(credentials);
        const accessToken = await this.accessTokenService.createAccessToken(user.id, this.ACCESS_TOKEN_TTL);
        const refreshToken = await this.refreshTokenService.createRefreshToken(user.id, this.REFRESH_TOKEN_TTL);
        return { accessToken, refreshToken };
    }

}