import {
    Controller, Get, Post, Delete,
    Param, Body, Req, UseGuards, HttpCode
} from '@nestjs/common';
import { ApiKeyGuard } from './guards/api_key.guard';
import { RedisApiService } from './redis.api.service';
import { SetCacheDto } from '../../DTOs/redis-api/set_cache.dto';
import { Request } from 'express';

@Controller('cache')
@UseGuards(ApiKeyGuard)
export class RedisApiController {
    constructor(private readonly redisApiService: RedisApiService) { }

    @Get(':key')
    async get(@Param('key') key: string, @Req() req: Request & { namespace: string }) {
        return this.redisApiService.get(req.namespace, key);
    }

    @Post(':key')
    async set(
        @Param('key') key: string,
        @Body() dto: SetCacheDto,
        @Req() req: Request & { namespace: string },
    ) {
        return this.redisApiService.set(req.namespace, key, dto.value, dto.ttl);
    }

    @Delete(':key')
    @HttpCode(200)
    async del(@Param('key') key: string, @Req() req: Request & { namespace: string }) {
        return this.redisApiService.del(req.namespace, key);
    }
}