import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CleanupService {
    constructor(private readonly usersService: UsersService) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async cleanupPendingUsers() {
        const result = await this.usersService.deletePendingOlderThan(0.05);
        console.log(`Cleanup: deleted ${result.count} expired pending users`);
    }
}