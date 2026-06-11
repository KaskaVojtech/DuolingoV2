import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('lesson_practice_types')
export class LessonPracticeType {
  @PrimaryColumn({ name: 'lesson_id', type: 'uuid' })
  lessonId: string;

  @PrimaryColumn({ length: 40 })
  type: string;

  @Column({ name: 'is_enabled', default: true })
  isEnabled: boolean;
}
