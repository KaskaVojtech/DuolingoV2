import { Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [PostgresModule, UsersModule, AuthModule, RedisModule],
  controllers: [],
  providers: [],
  exports: [UsersService],
})
export class AppModule {}
