import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('lesson_practice_config')
export class LessonPracticeConfig {
  @PrimaryColumn({ name: 'lesson_id', type: 'uuid' })
  lessonId: string;

  @Column({ name: 'is_practice_enabled', default: true })
  isPracticeEnabled: boolean;

  @Column({ name: 'last_generated_at', type: 'timestamptz', nullable: true })
  lastGeneratedAt: Date | null;
}
