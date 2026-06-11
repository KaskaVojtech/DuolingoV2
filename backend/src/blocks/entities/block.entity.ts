import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blocks')
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lesson_id', type: 'uuid' })
  lessonId: string;

  @Column({ length: 255, default: 'Nový blok' })
  title: string;

  @Column({ length: 20, default: 'content' })
  type: string;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

  @Column({ name: 'is_locked', default: false })
  isLocked: boolean;

  @Column({
    name: 'lock_config',
    type: 'jsonb',
    default: '{"mode":"toggle","isLocked":false,"constraintGroups":[]}',
  })
  lockConfig: any;

  @Column({ name: 'content_attributes', type: 'jsonb', nullable: true })
  contentAttributes: any | null;

  @Column({ name: 'exercise_attributes', type: 'jsonb', nullable: true })
  exerciseAttributes: any | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
