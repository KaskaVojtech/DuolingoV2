import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vocabulary_words')
export class VocabularyWord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'word_en', length: 255 })
  wordEn: string;

  @Column({ name: 'word_cs', length: 255 })
  wordCs: string;

  @Column({ length: 50, default: 'noun' })
  pos: string;

  @Column({ name: 'example_sentence', type: 'text', nullable: true })
  exampleSentence: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'pronunciation_url', type: 'varchar', length: 500, nullable: true })
  pronunciationUrl: string | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
