import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

 private client: RedisClientType = createClient({
    url: process.env["REDIS_URL"],
  });

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit(); 
  }

  set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      return this.client.set(key, value, { EX: ttlSeconds });
    }
    return this.client.set(key, value);
  }

  get(key: string) {
    return this.client.get(key);
  }

  del(key: string) {
    return this.client.del(key);
  }
}
