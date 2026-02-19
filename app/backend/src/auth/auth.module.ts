import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RedisModule } from 'src/redis/redis.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  controllers: [AuthController],
  imports: [RedisModule, UsersModule],   
  providers: [AuthService],
})
export class AuthModule {}
