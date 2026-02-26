import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PostgresModule } from 'src/postgres/postgres.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [PostgresModule],
  exports: [UsersService],
})
export class UsersModule {}
