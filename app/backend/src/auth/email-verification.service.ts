import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class EmailVerificationService {

    private readonly TTL = 60 * 60 * 24;

    constructor(private readonly redis: RedisService) {}

    // ============================================
    // MAIN METHODS
    // ============================================

    async createToken(userId: string): Promise<string> {
        const rawToken = randomBytes(32).toString('hex');
        const hashed = this.hash(rawToken);
        await this.redis.set(this.buildKey(hashed), userId, this.TTL);
        return rawToken;
    }


    async verifyAndConsume(rawToken: string): Promise<string | null> {
        const hashed = this.hash(rawToken);
        const key = this.buildKey(hashed);
        const userId = await this.redis.get(key);
        if (!userId) return null;
        await this.redis.del(key);
        return userId;
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private hash(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }

    private buildKey(hashed: string): string {
        return `email_verification:${hashed}`;
    }
}