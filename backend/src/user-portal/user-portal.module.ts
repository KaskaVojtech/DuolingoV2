/**
 * User (student) portal module.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity';
import { UserPortalService } from './user-portal.service';
import { UserPortalController } from './user-portal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [UserPortalService],
  controllers: [UserPortalController],
})
export class UserPortalModule {}
