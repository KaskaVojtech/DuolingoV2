import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IAccessTokenService } from "../interfaces/ITokenService";

@Injectable()
export class JwtTokenService implements IAccessTokenService {
    constructor(
        private readonly jwt: JwtService,
    ) {}

    // ============================================
    // MAIN METHODS
    // ============================================

    async createAccessToken(userId: string | number, ttlSeconds: number): Promise<string> {
        return this.jwt.signAsync(
            { sub: userId },
            { expiresIn: ttlSeconds }
        );
    }

    async verifyAccessToken(rawToken: string): Promise<boolean> {
        try {
            await this.jwt.verifyAsync(rawToken);
            return true;
        } 
        catch {
            return false;
        }
    }

    async getIdFromAccessToken(rawToken: string): Promise<string | number> {
        try {
            const payload = await this.jwt.verifyAsync(rawToken);
            return payload.sub;
        } catch {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }
}