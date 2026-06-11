import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid', nullable: true })
  courseId: string | null;

  @Column({ length: 255, default: 'Nová lekce' })
  title: string;

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

  @Column({ type: 'jsonb', default: '{"mode":"manual_button"}' })
  completion: any;

  @Column({ name: 'is_template', default: false })
  isTemplate: boolean;

  @Column({ name: 'template_id', type: 'uuid', nullable: true })
  templateId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
