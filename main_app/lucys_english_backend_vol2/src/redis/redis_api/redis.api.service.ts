import { Injectable, ForbiddenException } from '@nestjs/common';
import { RedisService } from '../redis.service';

@Injectable()
export class RedisApiService {
    constructor(private readonly redis: RedisService) { }

    private buildKey(namespace: string, key: string): string {
        return `${namespace}:${key}`;
    }

    private assertNamespace(namespace: string, key: string) {
        if (!key.startsWith(`${namespace}:`)) {
            throw new ForbiddenException(
                `You dont have acccess to the keys outside of namespace: "${namespace}"`
            );
        }
    }

    async set(namespace: string, key: string, value: string, ttl?: number) {
        const fullKey = this.buildKey(namespace, key);
        await this.redis.set(fullKey, value, ttl);
        return { key: fullKey, ttl: ttl ?? null };
    }

    async get(namespace: string, key: string) {
        const fullKey = this.buildKey(namespace, key);
        const value = await this.redis.get(fullKey);
        return { key: fullKey, value };
    }

    async del(namespace: string, key: string) {
        const fullKey = this.buildKey(namespace, key);
        await this.redis.del(fullKey);
        return { key: fullKey, deleted: true };
    }
}