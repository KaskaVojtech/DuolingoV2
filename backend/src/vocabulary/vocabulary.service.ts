/**
 * Vocabulary management: lesson words, import and cumulative words across previous lessons.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VocabularyWord } from './entities/vocabulary-word.entity';
import { LessonVocabulary } from './entities/lesson-vocabulary.entity';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(VocabularyWord)
    private readonly wordRepo: Repository<VocabularyWord>,
    @InjectRepository(LessonVocabulary)
    private readonly lessonVocabRepo: Repository<LessonVocabulary>,
  ) {}

  async checkDuplicate(wordEn: string, wordCs: string): Promise<{ exists: boolean; wordId?: string }> {
    const word = await this.wordRepo
      .createQueryBuilder('w')
      .where('LOWER(w.wordEn) = LOWER(:wordEn)', { wordEn })
      .andWhere('LOWER(w.wordCs) = LOWER(:wordCs)', { wordCs })
      .getOne();
    if (word) return { exists: true, wordId: word.id };
    return { exists: false };
  }

  async createWord(data: {
    wordEn: string;
    wordCs: string;
    pos: string;
    exampleSentence?: string | null;
    imageUrl?: string | null;
    pronunciationUrl?: string | null;
    note?: string | null;
  }): Promise<VocabularyWord> {
    const word = this.wordRepo.create(data);
    return this.wordRepo.save(word);
  }

  async updateWord(wordId: string, patch: any): Promise<VocabularyWord> {
    const word = await this.wordRepo.findOne({ where: { id: wordId } });
    if (!word) throw new NotFoundException(`VocabularyWord ${wordId} not found`);
    Object.assign(word, patch);
    return this.wordRepo.save(word);
  }

  async getLessonVocabulary(
    lessonId: string,
    filter: {
      searchQuery?: string;
      pos?: string | null;
      importedOnly?: boolean;
      sortField?: string;
      sortDirection?: string;
    },
  ): Promise<any[]> {
    const searchQuery = filter.searchQuery ?? '';
    const sortField = filter.sortField ?? 'added_at';
    const sortDirection = (filter.sortDirection ?? 'desc').toUpperCase();

    const allowedSort: Record<string, string> = {
      wordEn: 'w.word_en',
      wordCs: 'w.word_cs',
      addedAt: 'lv.added_at',
      added_at: 'lv.added_at',
    };
    const sortCol = allowedSort[sortField] ?? 'lv.added_at';
    const sortDir = sortDirection === 'ASC' ? 'ASC' : 'DESC';

    const params: any[] = [lessonId, searchQuery];
    let extraWhere = '';
    let paramIndex = 3;

    if (filter.pos) {
      extraWhere += ` AND w.pos = $${paramIndex}`;
      params.push(filter.pos);
      paramIndex++;
    }
    if (filter.importedOnly) {
      extraWhere += ` AND lv.imported_from_lesson_id IS NOT NULL`;
    }

    const rows = await this.wordRepo.query(
      `SELECT lv.id as entry_id, lv.lesson_id, lv.added_at, lv.imported_from_lesson_id,
              il.title as imported_from_lesson_title,
              w.id as word_id, w.word_en, w.word_cs, w.pos, w.example_sentence,
              w.image_url, w.pronunciation_url, w.note, w.created_at as word_created_at, w.updated_at as word_updated_at
       FROM lesson_vocabulary lv
       JOIN vocabulary_words w ON w.id = lv.vocabulary_id
       LEFT JOIN lessons il ON il.id = lv.imported_from_lesson_id
       WHERE lv.lesson_id = $1
         AND ($2 = '' OR w.word_en ILIKE '%' || $2 || '%' OR w.word_cs ILIKE '%' || $2 || '%')
       ${extraWhere}
       ORDER BY ${sortCol} ${sortDir}`,
      params,
    );

    return rows.map((r: any) => ({
      id: r.entry_id,
      lessonId: r.lesson_id,
      addedAt: r.added_at,
      importedFromLessonId: r.imported_from_lesson_id,
      importedFromLessonTitle: r.imported_from_lesson_title ?? null,
      word: {
        id: r.word_id,
        wordEn: r.word_en,
        wordCs: r.word_cs,
        pos: r.pos,
        exampleSentence: r.example_sentence,
        imageUrl: r.image_url,
        pronunciationUrl: r.pronunciation_url,
        note: r.note,
        createdAt: r.word_created_at,
        updatedAt: r.word_updated_at,
      },
    }));
  }

  async getLessonVocabularyWords(lessonId: string): Promise<VocabularyWord[]> {
    const rows = await this.wordRepo.query(
      `SELECT w.* FROM vocabulary_words w
       JOIN lesson_vocabulary lv ON lv.vocabulary_id = w.id
       WHERE lv.lesson_id = $1
       ORDER BY w.word_en ASC`,
      [lessonId],
    );
    return rows;
  }

  async getCumulativeWords(lessonId: string): Promise<any[]> {
    return this.wordRepo.query(
      `SELECT DISTINCT ON (w.id)
         w.id,
         w.word_en           AS "wordEn",
         w.word_cs           AS "wordCs",
         w.pos,
         w.example_sentence  AS "exampleSentence",
         w.image_url         AS "imageUrl",
         w.pronunciation_url AS "pronunciationUrl",
         w.note,
         w.created_at        AS "createdAt",
         w.updated_at        AS "updatedAt"
       FROM vocabulary_words w
       JOIN lesson_vocabulary lv ON lv.vocabulary_id = w.id
       JOIN lessons l ON l.id = lv.lesson_id
       JOIN lessons cur ON cur.id = $1
       WHERE l.id = cur.id
          OR (cur.course_id IS NOT NULL
              AND l.course_id = cur.course_id
              AND l.order_index <= cur.order_index)
       ORDER BY w.id`,
      [lessonId],
    );
  }

  async addWordToLesson(lessonId: string, vocabularyId: string): Promise<any> {
    const entry = this.lessonVocabRepo.create({ lessonId, vocabularyId });
    const saved = await this.lessonVocabRepo.save(entry);

    const word = await this.wordRepo.findOne({ where: { id: vocabularyId } });
    return {
      id: saved.id,
      lessonId: saved.lessonId,
      addedAt: saved.addedAt,
      importedFromLessonId: saved.importedFromLessonId,
      importedFromLessonTitle: null,
      word,
    };
  }

  async removeWordFromLesson(lessonId: string, entryId: string): Promise<void> {
    const entry = await this.lessonVocabRepo.findOne({ where: { id: entryId, lessonId } });
    if (!entry) throw new NotFoundException(`LessonVocabulary entry ${entryId} not found`);
    await this.lessonVocabRepo.remove(entry);
  }

  async importWords(lessonId: string, sourceWordIds: string[], importedFromLessonId: string): Promise<void> {
    for (const vocabularyId of sourceWordIds) {
      await this.lessonVocabRepo.query(
        `INSERT INTO lesson_vocabulary (id, lesson_id, vocabulary_id, imported_from_lesson_id, added_at)
         VALUES (gen_random_uuid(), $1, $2, $3, NOW())
         ON CONFLICT (lesson_id, vocabulary_id) DO NOTHING`,
        [lessonId, vocabularyId, importedFromLessonId],
      );
    }
  }

  async getLessonsForImport(excludeLessonId: string): Promise<{ id: string; title: string; courseTitle: string; wordCount: number }[]> {
    const rows = await this.wordRepo.query(
      `SELECT l.id, l.title,
        COALESCE(co.title, '') as course_title,
        COALESCE(wc.cnt, 0)::int as word_count
       FROM lessons l
       LEFT JOIN courses co ON co.id = l.course_id
       LEFT JOIN (SELECT lesson_id, COUNT(*) as cnt FROM lesson_vocabulary GROUP BY lesson_id) wc ON wc.lesson_id = l.id
       WHERE l.id != $1
       ORDER BY l.updated_at DESC`,
      [excludeLessonId],
    );
    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      courseTitle: r.course_title,
      wordCount: r.word_count,
    }));
  }
}
