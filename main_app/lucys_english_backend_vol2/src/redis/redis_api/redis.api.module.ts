import { Module } from '@nestjs/common';
import { RedisApiService } from './redis.api.service';
import { RedisApiController } from './redis.api.controller';
import { RedisModule } from '../redis.module';

@Module({
    imports: [RedisModule],
    controllers: [RedisApiController],
    providers: [RedisApiService],
})
export class RedisApiModule { }