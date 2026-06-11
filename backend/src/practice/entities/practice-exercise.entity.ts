import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('practice_exercises')
export class PracticeExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lesson_id', type: 'uuid' })
  lessonId: string;

  @Column({ length: 40 })
  type: string;

  @Column({ type: 'jsonb' })
  data: Record<string, unknown>;

  @CreateDateColumn({ name: 'generated_at', type: 'timestamptz' })
  generatedAt: Date;
}
