/**
 * Access codes and course access module.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessCode } from './entities/access-code.entity';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccessCode])],
  providers: [AccessService],
  controllers: [AccessController],
})
export class AccessModule {}
