import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PostgresModule } from '../postgres/postgres.module';
import { UsersController } from './users.controller';
import { UserProfileController } from './user-profile.controller';

@Module({
    imports: [PostgresModule],
    providers: [UsersService],
    controllers: [UsersController, UserProfileController],
    exports: [UsersService],
})
export class UsersModule { }