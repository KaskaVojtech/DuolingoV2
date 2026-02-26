import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IRefreshTokenService } from "../interfaces/ITokenService";
import { randomBytes, createHash } from 'crypto';
import { RedisService } from 'src/redis/redis.service';


@Injectable()
export class OpaqueService implements IRefreshTokenService {

    constructor(
    private readonly redis: RedisService,
    ){}

    // ============================================
    // MAIN METHODS
    // ============================================

    async createRefreshToken(userId: string | number, ttlSeconds: number): Promise<string> {
        const rawToken = randomBytes(64).toString('hex');

        const hashedToken = createHash('sha256').update(rawToken).digest('hex')

        const key = this.buildRefreshTokenKey(hashedToken);

        await this.redis.set(key, String(userId),ttlSeconds);

        return rawToken;
    }


    async deleteRefreshToken(rawToken: string): Promise<void> {
        const hashedToken = createHash('sha256').update(rawToken).digest('hex');

        const key = this.buildRefreshTokenKey(hashedToken);

        const userId = await this.redis.get(key);

        if (!userId) throw new UnauthorizedException('Invalid or expired refresh token');

        await this.redis.del(key);
    }
    
    async verifyRefreshToken(rawToken: string): Promise<boolean> {
        const hashedToken = createHash('sha256').update(rawToken).digest('hex');

        const userId = await this.redis.get(this.buildRefreshTokenKey(hashedToken));

        return !!userId;   
    }

    async refreshRefreshToken(rawToken: string, userId: number | string, ttlSeconds: number): Promise<string> {
        await this.deleteRefreshToken(rawToken);

        const newRefreshToken = await this.createRefreshToken(userId, ttlSeconds);

        return newRefreshToken
    }

    async getIdFromRefreshToken(rawToken: string): Promise<string | number> {
        const hashedToken = createHash('sha256').update(rawToken).digest('hex');

        const userId = await this.redis.get(this.buildRefreshTokenKey(hashedToken));

        if (!userId) throw new UnauthorizedException('Invalid or expired refresh token');
        
        return userId;
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private buildRefreshTokenKey(hashedToken: string) {
        return `refresh_token:${hashedToken}`;
    }

}