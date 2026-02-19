import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { randomBytes, createHash } from 'crypto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {


    constructor(
        private readonly redis: RedisService,
        private readonly userService: UsersService,
    ){}

// ============================================
// MAIN METHODS
// ============================================

//--------------TOKENS METHODS------------

    async createRefreshToken(userId: string | number, ttlSeconds: number) {
        const rawToken = randomBytes(64).toString('hex');
        const hashedToken = createHash('sha256').update(rawToken).digest('hex')

        const key = this.buildRefreshTokenKey(hashedToken);

        await this.redis.set(key, String(userId),ttlSeconds);

        return rawToken;
    }

    async verifyRefreshToken(rawToken: string){
        const hashedToken = createHash('sha256').update(rawToken).digest('hex');

        const userId = await this.redis.get(this.buildRefreshTokenKey(hashedToken))

        if (!userId) throw new UnauthorizedException('Invalid or expired refresh token');
        return userId;    
    }

    async deleteRefreshToken(rawToken: string){  
        const hashedToken = createHash('sha256').update(rawToken).digest('hex');

        const key = this.buildRefreshTokenKey(hashedToken);

        await this.redis.del(key);

    }

    async refreshRefreshToken(rawToken: string, ttlSeconds: number){
        const userId = await this.verifyRefreshToken(rawToken);

        await this.deleteRefreshToken(rawToken);

        const newRefreshToken = await this.createRefreshToken(userId, ttlSeconds);

        return {userId, refreshToken: newRefreshToken};
    }

//--------------AUTH METHODS------------

    async loginWithEmail(email: string, password: string, ttlSeconds: number){
        const user = await this.userService.findByEmail(email);

        if (!user || !user.email || !user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive || user.status !== 'active') {
            throw new UnauthorizedException('User is not active');
        }

        const ok = await bcrypt.compare(password, user.passwordHash);

        if (!ok) { 
            throw new UnauthorizedException('Invalid credentials'); 
        }

        return this.createRefreshToken(user.id,ttlSeconds);
    }

    async logout(rawToken: string){
        await this.deleteRefreshToken(rawToken);
    }



// ============================================
// HELPER METHODS
// ============================================

    private buildRefreshTokenKey(hashedToken: string) {
        return `refresh_token:${hashedToken}`;
    }

    

}
