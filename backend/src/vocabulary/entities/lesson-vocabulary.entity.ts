import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lesson_vocabulary')
export class LessonVocabulary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lesson_id', type: 'uuid' })
  lessonId: string;

  @Column({ name: 'vocabulary_id', type: 'uuid' })
  vocabularyId: string;

  @Column({ name: 'imported_from_lesson_id', type: 'uuid', nullable: true })
  importedFromLessonId: string | null;

  @Column({ name: 'added_at', type: 'timestamptz', default: () => 'NOW()' })
  addedAt: Date;
}
