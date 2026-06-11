/**
 * User groups module.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from './entities/user-group.entity';
import { UserGroupMember } from './entities/user-group-member.entity';
import { GroupCourseAssignment } from './entities/group-course-assignment.entity';
import { User } from '../users/entities/user.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroup, UserGroupMember, GroupCourseAssignment, User])],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
