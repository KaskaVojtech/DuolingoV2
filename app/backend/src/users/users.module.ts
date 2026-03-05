import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PostgresModule } from 'src/postgres/postgres.module';
import { AccessCodeRegisterStrategy } from './register-strategies/access-code-register-strategy.service';
import { EmailPasswordRegisterStrategy } from './register-strategies/email-password-register-strategy.service';

@Module({
 providers: [UsersService, AccessCodeRegisterStrategy, EmailPasswordRegisterStrategy],
  controllers: [UsersController],
  imports: [PostgresModule],
  exports: [UsersService, AccessCodeRegisterStrategy, EmailPasswordRegisterStrategy], 
})
export class UsersModule {}
