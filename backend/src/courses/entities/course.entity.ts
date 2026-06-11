import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'thumbnail_color', type: 'varchar', length: 50, default: '#4f6ef7' })
  thumbnailColor: string;

  @Column({ type: 'varchar', length: 20, default: 'private' })
  visibility: string;

  @Column({ name: 'is_locked', type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ name: 'lock_mode', type: 'varchar', length: 20, default: 'toggle' })
  lockMode: string;

  @Column({ name: 'access_from', type: 'timestamptz', nullable: true })
  accessFrom: Date | null;

  @Column({ name: 'access_until', type: 'timestamptz', nullable: true })
  accessUntil: Date | null;

  @Column({ name: 'is_template', default: false })
  isTemplate: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @Column({ name: 'scheduled_delete_at', type: 'timestamptz', nullable: true })
  scheduledDeleteAt: Date | null;
}
