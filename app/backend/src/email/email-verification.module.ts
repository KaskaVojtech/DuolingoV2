import { Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
    imports: [RedisModule],
    providers: [EmailVerificationService],
    exports: [EmailVerificationService],
})
export class EmailVerificationModule {}