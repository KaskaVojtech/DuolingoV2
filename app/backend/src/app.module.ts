import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostgresModule } from './postgres/postgres.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    PostgresModule,
    RedisModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
