import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('exercises')
export class Exercise {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'lesson_id', type: 'uuid' })
  lessonId: string;

  @Column({ length: 255, default: 'Nové cvičení' })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  instructions: string | null;

  @Column({ default: 10 })
  xp: number;

  @Column({ type: 'jsonb', default: '[]' })
  items: any[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
