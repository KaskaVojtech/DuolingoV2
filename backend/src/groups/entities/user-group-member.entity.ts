import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_group_members')
export class UserGroupMember {
  @PrimaryColumn({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @CreateDateColumn({ name: 'added_at', type: 'timestamptz' })
  addedAt: Date;
}
