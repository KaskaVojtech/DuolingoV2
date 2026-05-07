import { Module } from '@nestjs/common';
import { AccessCodesService } from './access-codes.service';
import { AccessCodesController } from './access-codes.controller';
import { PostgresModule } from '../postgres/postgres.module';

@Module({
    imports: [PostgresModule],
    providers: [AccessCodesService],
    controllers: [AccessCodesController],
})
export class AccessCodesModule { }