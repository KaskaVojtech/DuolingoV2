import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { RolesGuard } from './guards/roles.guard';


@Module({
    imports:
        [
            UsersModule,
            EmailModule,
            RedisModule,
            JwtModule.register({}),
        ],
    providers: [AuthService, JwtAccessStrategy, RolesGuard],
    controllers: [AuthController],
})
export class AuthModule { }