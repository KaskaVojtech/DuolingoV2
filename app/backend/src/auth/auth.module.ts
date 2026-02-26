import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { EmailPasswordStrategy } from "./auth-strategies/email-password-strategy.service";
import { AccessCodeStrategy } from "./auth-strategies/access-code-strategy.service";
import { OpaqueService } from "./tokenServices/opaque.service";
import { JwtTokenService } from "./tokenServices/jwt.service";
import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { RedisModule } from "src/redis/redis.module";
import { AccessTokenGuard } from "./access-token.guard";
import { AuthController } from "./auth.controller";


@Module({
  imports: [
    UsersModule,
    RedisModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailPasswordStrategy,
    AccessCodeStrategy,
    OpaqueService,
    JwtTokenService,
    {
      provide: 'IRefreshTokenService',
      useClass: OpaqueService,
    },
    {
      provide: 'IAccessTokenService',
      useClass: JwtTokenService,
    },
  ],
  exports: [AuthService, AccessTokenGuard],
})
export class AuthModule {}