import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';
import { RedisService } from '../redis/redis.service';

const VERIFY_TOKEN_TTL = 60 * 60 * 24;
const REDIS_PREFIX = 'email:verify:';
const REDIS_USER_PREFIX = 'email:verify:user:';

@Injectable()
export class EmailService {
    private readonly resend = new Resend(process.env.RESEND_API_KEY!);

    constructor(private readonly redis: RedisService) { }

    async createRegisterVerification(userId: number, email: string): Promise<void> {
        const existingToken = await this.redis.get(`${REDIS_USER_PREFIX}${userId}`);
        if (existingToken) {
            await this.redis.del(`${REDIS_PREFIX}${existingToken}`);
        }

        const token = randomUUID();

        await this.redis.set(`${REDIS_PREFIX}${token}`, String(userId), VERIFY_TOKEN_TTL);
        await this.redis.set(`${REDIS_USER_PREFIX}${userId}`, token, VERIFY_TOKEN_TTL);

        const verifyUrl = this.buildVerifyUrl(token);
        await this.resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: process.env.NODE_ENV === 'production' ? email : process.env.EMAIL_TO_TEST!,
            subject: 'Potvrzení registrace',
            html: this.buildVerificationEmail(verifyUrl),
        });
    }


    async resolveVerificationToken(token: string): Promise<number | null> {
        const userId = await this.redis.get(`${REDIS_PREFIX}${token}`);
        if (!userId) return null;

        await this.redis.del(`${REDIS_PREFIX}${token}`);
        await this.redis.del(`${REDIS_USER_PREFIX}${userId}`);

        return Number(userId);
    }

    // --- helpers ---

    private buildVerifyUrl(token: string): string {
        const base = process.env.APP_URL;

        return `${base}/verify-email?token=${token}`;
    }

    private buildVerificationEmail(verifyUrl: string): string {
        return `
      <h2>Potvrď svůj účet</h2>
      <p>Klikni na odkaz níže pro dokončení registrace. Odkaz je platný 24 hodin.</p>
      <a href="${verifyUrl}" style="padding:10px 20px;background:#4F46E5;color:#fff;border-radius:6px;text-decoration:none;">
        Potvrdit účet
      </a>
      <p>Pokud jsi o registraci nežádal(a), tento email ignoruj.</p>
    `;
    }
}