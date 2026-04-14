import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule],
    providers: [CleanupService],
})
export class CleanupModule { }