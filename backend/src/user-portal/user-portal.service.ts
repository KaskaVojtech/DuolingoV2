/**
 * Student-side domain logic: course access, delivering lesson content (blocks/exercise/mix) with lock evaluation, saving results and XP, vocabulary and progress aggregation.
 */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class UserPortalService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  private accessPredicate(courseAlias: string): string {
    return `(
      EXISTS (SELECT 1 FROM user_course_assignments uca
              WHERE uca.course_id = ${courseAlias}.id AND uca.user_id = $1)
      OR EXISTS (SELECT 1 FROM group_course_assignments gca
                 JOIN user_group_members ugm ON ugm.group_id = gca.group_id
                 WHERE gca.course_id = ${courseAlias}.id AND ugm.user_id = $1)
    )`;
  }

  async getMyCourses(userId: string) {
    const rows = await this.courseRepo.query(
      `SELECT DISTINCT c.id as "courseId", c.title, c.description,
              c.thumbnail_url as "thumbnailUrl", c.thumbnail_color as "thumbnailColor"
       FROM courses c
       WHERE c.deleted_at IS NULL AND ${this.accessPredicate('c')}
       ORDER BY c.title`,
      [userId],
    );

    return rows.map((r) => ({
      courseId: r.courseId,
      title: r.title,
      description: r.description,
      thumbnailUrl: r.thumbnailUrl,
      thumbnailColor: r.thumbnailColor,
      validFrom: null,
      validUntil: null,
    }));
  }

  async getCourseLessons(userId: string, courseId: string) {

    const access = await this.courseRepo.query(
      `SELECT 1 FROM courses c WHERE c.id = $2 AND ${this.accessPredicate('c')} LIMIT 1`,
      [userId, courseId],
    );
    if (!access.length) throw new NotFoundException('Přístup ke kurzu nenalezen');

    const lessons = await this.courseRepo.query(
      `SELECT l.id, l.title, l.order_index as "order", l.is_locked as "isLocked",
              l.lock_config as "lockConfig", l.completion as "completion",
              -- mandatory blocks counts per lesson
              COUNT(b.id) FILTER (WHERE b.exercise_attributes->>'isMandatory' = 'true') AS "mandatoryExerciseBlocks",
              COUNT(b.id) FILTER (WHERE b.content_attributes IS NOT NULL) AS "mandatoryContentBlocks",
              -- user completions
              ulc.completed_at IS NOT NULL AS "isCompleted",
              COUNT(ubc.block_id) AS "completedBlocksCount"
       FROM lessons l
       LEFT JOIN blocks b ON b.lesson_id = l.id
       LEFT JOIN user_lesson_completions ulc ON ulc.lesson_id = l.id AND ulc.user_id = $2
       LEFT JOIN user_block_completions ubc ON ubc.block_id = b.id AND ubc.user_id = $2
       WHERE l.course_id = $1 AND l.is_template = false
       GROUP BY l.id, l.title, l.order_index, l.is_locked, l.lock_config, l.completion, ulc.completed_at
       ORDER BY l.order_index`,
      [courseId, userId],
    );

    const completedRows = await this.courseRepo.query(
      `SELECT lesson_id FROM user_lesson_completions WHERE user_id = $1`,
      [userId],
    );
    const completedLessonIds = new Set<string>(completedRows.map((r: any) => r.lesson_id));

    const now = new Date();

    return lessons.map((l: any) => {
      const cfg = l.lockConfig ?? {};
      const lockMode: string = cfg.mode ?? 'toggle';
      const completion = l.completion ?? {};
      const completionMode: string = completion.mode ?? 'manual_button';
      const blockScope: string = completion.blockScope ?? 'exercise';

      let isLocked: boolean;
      if (lockMode === 'toggle') {
        isLocked = l.isLocked ?? cfg.isLocked ?? false;
      } else if (lockMode === 'scheduled') {
        const unlockAt = cfg.unlockAt ? new Date(cfg.unlockAt) : null;
        const lockAt   = cfg.lockAt   ? new Date(cfg.lockAt)   : null;
        isLocked = (unlockAt ? now < unlockAt : false) || (lockAt ? now > lockAt : false);
      } else if (lockMode === 'constraint') {
        const groups: any[] = cfg.constraintGroups ?? [];
        if (groups.length === 0) {
          isLocked = false;
        } else {

          const anyGroupSatisfied = groups.some((group: any) => {
            const rules: any[] = group.rules ?? [];
            if (rules.length === 0) return true;
            return rules.every((rule: any) => completedLessonIds.has(rule.sourceLessonId));
          });
          isLocked = !anyGroupSatisfied;
        }
      } else {
        isLocked = l.isLocked ?? false;
      }

      const mandatoryExercise = parseInt(l.mandatoryExerciseBlocks ?? '0', 10);
      const mandatoryContent  = parseInt(l.mandatoryContentBlocks ?? '0', 10);
      let mandatoryTotal = 0;
      if (blockScope === 'exercise') mandatoryTotal = mandatoryExercise;
      else if (blockScope === 'content') mandatoryTotal = mandatoryContent;
      else mandatoryTotal = mandatoryExercise + mandatoryContent;

      const completedBlocks = parseInt(l.completedBlocksCount ?? '0', 10);
      const isCompleted = l.isCompleted === true || l.isCompleted === 't';

      const blocksAllDone = mandatoryTotal > 0 && completedBlocks >= mandatoryTotal;

      return {
        id: l.id,
        title: l.title,
        order: l.order,
        isLocked,
        lockMode,
        unlockAt: cfg.unlockAt ?? null,
        lockAt: cfg.lockAt ?? null,
        completionMode,
        blockScope,
        isCompleted,
        mandatoryBlocksTotal: mandatoryTotal,
        mandatoryBlocksDone: completedBlocks,
        blocksAllDone,
      };
    });
  }

  async completeLesson(userId: string, lessonId: string) {
    await this.courseRepo.query(
      `INSERT INTO user_lesson_completions (user_id, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, lessonId],
    );
  }

  async uncompleteLesson(userId: string, lessonId: string) {
    await this.courseRepo.query(
      `DELETE FROM user_lesson_completions WHERE user_id = $1 AND lesson_id = $2`,
      [userId, lessonId],
    );
  }

  async completeBlock(userId: string, blockId: string) {
    await this.courseRepo.query(
      `INSERT INTO user_block_completions (user_id, block_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, blockId],
    );
  }

  async uncompleteBlock(userId: string, blockId: string) {
    await this.courseRepo.query(
      `DELETE FROM user_block_completions WHERE user_id = $1 AND block_id = $2`,
      [userId, blockId],
    );
  }

  async getLessonContent(userId: string, lessonId: string) {

    const lessonRows = await this.courseRepo.query(
      `SELECT l.id, l.title, l.course_id AS "courseId", l.completion,
              c.title AS "courseTitle", c.thumbnail_color AS "courseColor"
       FROM lessons l
       JOIN courses c ON c.id = l.course_id
       WHERE l.id = $2 AND l.is_template = false AND c.deleted_at IS NULL
         AND ${this.accessPredicate('c')}
       LIMIT 1`,
      [userId, lessonId],
    );
    if (!lessonRows.length) throw new NotFoundException('Lekce nenalezena nebo bez přístupu');
    const lesson = lessonRows[0];

    const blocks = await this.courseRepo.query(
      `SELECT b.id, b.title, b.type, b.order_index AS "order",
              b.is_locked AS "isLocked", b.lock_config AS "lockConfig",
              b.content_attributes AS "contentAttributes",
              b.exercise_attributes AS "exerciseAttributes",
              (ubc.block_id IS NOT NULL) AS "isCompleted"
       FROM blocks b
       LEFT JOIN user_block_completions ubc ON ubc.block_id = b.id AND ubc.user_id = $2
       WHERE b.lesson_id = $1
       ORDER BY b.order_index`,
      [lessonId, userId],
    );

    const blockIds: string[] = blocks.map((b: any) => b.id);
    const completedBlockIds = new Set<string>(
      blocks.filter((b: any) => b.isCompleted === true || b.isCompleted === 't').map((b: any) => b.id),
    );

    const contentRows = blockIds.length
      ? await this.courseRepo.query(
          `SELECT id, title, blocks FROM block_contents WHERE id = ANY($1)`,
          [blockIds],
        )
      : [];
    const exerciseRows = blockIds.length
      ? await this.courseRepo.query(
          `SELECT id, title, instructions, xp, items FROM exercises WHERE id = ANY($1)`,
          [blockIds],
        )
      : [];
    const mixRows = await this.courseRepo.query(
      `SELECT games, is_random_order AS "isRandomOrder", xp FROM lesson_mixes WHERE lesson_id = $1 LIMIT 1`,
      [lessonId],
    );
    const resultRows = await this.courseRepo.query(
      `SELECT block_id AS "blockId", score, total, xp_earned AS "xpEarned"
       FROM user_activity_results WHERE user_id = $1 AND lesson_id = $2`,
      [userId, lessonId],
    );

    const contentMap = new Map(contentRows.map((r: any) => [r.id, r]));
    const exerciseMap = new Map(exerciseRows.map((r: any) => [r.id, r]));
    const resultMap = new Map(resultRows.map((r: any) => [r.blockId, r]));
    const mix = mixRows[0] ?? null;

    const now = new Date();
    const mappedBlocks = blocks.map((b: any) => {
      const cfg = b.lockConfig ?? {};
      const lockMode: string = cfg.mode ?? 'toggle';
      let isLocked = false;
      let lockReason: string | null = null;

      if (lockMode === 'toggle') {
        isLocked = b.isLocked ?? cfg.isLocked ?? false;
        if (isLocked) lockReason = 'locked';
      } else if (lockMode === 'scheduled') {
        const unlockAt = cfg.unlockAt ? new Date(cfg.unlockAt) : null;
        const lockAt = cfg.lockAt ? new Date(cfg.lockAt) : null;
        if (unlockAt && now < unlockAt) { isLocked = true; lockReason = 'scheduled_future'; }
        else if (lockAt && now > lockAt) { isLocked = true; lockReason = 'scheduled_past'; }
      } else if (lockMode === 'constraint') {
        const groups: any[] = cfg.constraintGroups ?? [];
        if (groups.length > 0) {
          const anyGroupSatisfied = groups.some((g: any) => {
            const rules: any[] = g.rules ?? [];
            if (rules.length === 0) return true;
            return rules.every((rule: any) => completedBlockIds.has(rule.sourceBlockId));
          });
          isLocked = !anyGroupSatisfied;
          if (isLocked) lockReason = 'constraint';
        }
      }

      const out: any = {
        id: b.id,
        title: b.title,
        type: b.type,
        order: b.order,
        isLocked,
        lockReason,
        unlockAt: cfg.unlockAt ?? null,
        lockAt: cfg.lockAt ?? null,
        requiresReadConfirmation: b.contentAttributes?.requiresReadConfirmation ?? false,
        isMandatory: b.exerciseAttributes?.isMandatory ?? false,
        isCompleted: completedBlockIds.has(b.id),
        result: resultMap.get(b.id) ?? null,
      };

      if (!isLocked) {
        if (b.type === 'content') {
          const c: any = contentMap.get(b.id);
          out.content = c ? { blocks: c.blocks ?? [] } : { blocks: [] };
        } else if (b.type === 'exercise') {
          const e: any = exerciseMap.get(b.id);
          out.exercise = e
            ? { instructions: e.instructions, xp: e.xp, items: e.items ?? [] }
            : { instructions: null, xp: 0, items: [] };
        } else if (b.type === 'mix') {
          out.mix = mix
            ? { games: mix.games ?? [], isRandomOrder: mix.isRandomOrder, xp: mix.xp }
            : { games: [], isRandomOrder: false, xp: 0 };
        }
      }
      return out;
    });

    return {
      id: lesson.id,
      title: lesson.title,
      courseId: lesson.courseId,
      courseTitle: lesson.courseTitle,
      courseColor: lesson.courseColor,
      completion: lesson.completion ?? { mode: 'manual_button' },
      blocks: mappedBlocks,
    };
  }

  async submitActivity(
    userId: string,
    blockId: string,
    body: { kind: 'exercise' | 'mix'; score: number; total: number; xp: number },
  ) {
    const rows = await this.courseRepo.query(
      `SELECT b.lesson_id AS "lessonId" FROM blocks b
       JOIN lessons l ON l.id = b.lesson_id
       JOIN courses c ON c.id = l.course_id
       WHERE b.id = $2 AND ${this.accessPredicate('c')} LIMIT 1`,
      [userId, blockId],
    );
    if (!rows.length) throw new NotFoundException('Blok nenalezen nebo bez přístupu');
    const lessonId = rows[0].lessonId;

    const score = Math.max(0, Math.round(body.score ?? 0));
    const total = Math.max(0, Math.round(body.total ?? 0));
    const xp = Math.max(0, Math.round(body.xp ?? 0));

    await this.courseRepo.query(
      `INSERT INTO user_activity_results (user_id, block_id, lesson_id, kind, score, total, xp_earned, attempts)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 1)
       ON CONFLICT (user_id, block_id) DO UPDATE SET
         score = GREATEST(user_activity_results.score, EXCLUDED.score),
         total = EXCLUDED.total,
         xp_earned = GREATEST(user_activity_results.xp_earned, EXCLUDED.xp_earned),
         attempts = user_activity_results.attempts + 1,
         updated_at = NOW()`,
      [userId, blockId, lessonId, body.kind, score, total, xp],
    );

    if (total > 0 && score >= total) {
      await this.completeBlock(userId, blockId);
    }
    return { ok: true };
  }

  async getLessonVocabulary(userId: string, lessonId: string) {
    const access = await this.courseRepo.query(
      `SELECT 1 FROM lessons l JOIN courses c ON c.id = l.course_id
       WHERE l.id = $2 AND ${this.accessPredicate('c')} LIMIT 1`,
      [userId, lessonId],
    );
    if (!access.length) throw new NotFoundException('Bez přístupu');

    return this.courseRepo.query(
      `SELECT v.id, v.word_en AS "wordEn", v.word_cs AS "wordCs", v.pos,
              v.example_sentence AS "exampleSentence", v.image_url AS "imageUrl",
              v.pronunciation_url AS "pronunciationUrl", v.note
       FROM lesson_vocabulary lv
       JOIN vocabulary_words v ON v.id = lv.vocabulary_id
       WHERE lv.lesson_id = $1
       ORDER BY v.word_en`,
      [lessonId],
    );
  }

  async getCourseVocabulary(userId: string, courseId: string) {
    const access = await this.courseRepo.query(
      `SELECT 1 FROM courses c WHERE c.id = $2 AND ${this.accessPredicate('c')} LIMIT 1`,
      [userId, courseId],
    );
    if (!access.length) throw new NotFoundException('Bez přístupu');

    return this.courseRepo.query(
      `SELECT DISTINCT v.id, v.word_en AS "wordEn", v.word_cs AS "wordCs", v.pos,
              v.example_sentence AS "exampleSentence", v.image_url AS "imageUrl",
              v.pronunciation_url AS "pronunciationUrl", v.note,
              l.title AS "lessonTitle", l.order_index AS "lessonOrder"
       FROM lessons l
       JOIN lesson_vocabulary lv ON lv.lesson_id = l.id
       JOIN vocabulary_words v ON v.id = lv.vocabulary_id
       WHERE l.course_id = $1 AND l.is_template = false
       ORDER BY l.order_index, v.word_en`,
      [courseId],
    );
  }

  async getLessonPractice(userId: string, lessonId: string) {
    const lessonRows = await this.courseRepo.query(
      `SELECT l.id, l.title, l.course_id AS "courseId"
       FROM lessons l JOIN courses c ON c.id = l.course_id
       WHERE l.id = $2 AND l.is_template = false AND ${this.accessPredicate('c')} LIMIT 1`,
      [userId, lessonId],
    );
    if (!lessonRows.length) throw new NotFoundException('Bez přístupu');
    const lesson = lessonRows[0];

    const configRows = await this.courseRepo.query(
      `SELECT is_practice_enabled AS "isPracticeEnabled" FROM lesson_practice_config WHERE lesson_id = $1 LIMIT 1`,
      [lessonId],
    );
    const isPracticeEnabled = configRows.length ? configRows[0].isPracticeEnabled : true;

    const typeRows = await this.courseRepo.query(
      `SELECT type FROM lesson_practice_types WHERE lesson_id = $1 AND is_enabled = true`,
      [lessonId],
    );

    const allTypes = [
      'vocab_multiple_choice', 'vocab_translation', 'vocab_memory', 'vocab_drag', 'vocab_spelling',
      'sent_fill_in', 'sent_word_order', 'sent_translation',
      'listen_multiple_choice', 'listen_write',
    ];
    const enabledTypes = typeRows.length ? typeRows.map((r: any) => r.type) : allTypes;

    const words = await this.courseRepo.query(
      `SELECT v.id, v.word_en AS "wordEn", v.word_cs AS "wordCs", v.pos,
              v.example_sentence AS "exampleSentence", v.image_url AS "imageUrl",
              v.pronunciation_url AS "pronunciationUrl"
       FROM lesson_vocabulary lv
       JOIN vocabulary_words v ON v.id = lv.vocabulary_id
       WHERE lv.lesson_id = $1
       ORDER BY v.word_en`,
      [lessonId],
    );

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      courseId: lesson.courseId,
      isPracticeEnabled,
      enabledTypes,
      words,
    };
  }

  async getProgress(userId: string) {
    const totals = await this.courseRepo.query(
      `SELECT
         COALESCE((SELECT SUM(xp_earned) FROM user_activity_results WHERE user_id = $1), 0) AS "totalXp",
         (SELECT COUNT(*) FROM user_lesson_completions WHERE user_id = $1) AS "completedLessons",
         (SELECT COUNT(*) FROM user_block_completions WHERE user_id = $1) AS "completedBlocks"`,
      [userId],
    );

    const perCourse = await this.courseRepo.query(
      `SELECT c.id AS "courseId", c.title, c.thumbnail_color AS "thumbnailColor",
              COUNT(DISTINCT l.id) AS "totalLessons",
              COUNT(DISTINCT ulc.lesson_id) AS "completedLessons",
              COALESCE(SUM(uar.xp), 0) AS "earnedXp"
       FROM courses c
       LEFT JOIN lessons l ON l.course_id = c.id AND l.is_template = false
       LEFT JOIN user_lesson_completions ulc ON ulc.lesson_id = l.id AND ulc.user_id = $1
       LEFT JOIN (
         SELECT lesson_id, SUM(xp_earned) AS xp FROM user_activity_results
         WHERE user_id = $1 GROUP BY lesson_id
       ) uar ON uar.lesson_id = l.id
       WHERE c.deleted_at IS NULL AND ${this.accessPredicate('c')}
       GROUP BY c.id, c.title, c.thumbnail_color
       ORDER BY c.title`,
      [userId],
    );

    const t = totals[0] ?? {};
    return {
      totalXp: parseInt(t.totalXp ?? '0', 10),
      completedLessons: parseInt(t.completedLessons ?? '0', 10),
      completedBlocks: parseInt(t.completedBlocks ?? '0', 10),
      courses: perCourse.map((r: any) => ({
        courseId: r.courseId,
        title: r.title,
        thumbnailColor: r.thumbnailColor,
        totalLessons: parseInt(r.totalLessons ?? '0', 10),
        completedLessons: parseInt(r.completedLessons ?? '0', 10),
        earnedXp: parseInt(r.earnedXp ?? '0', 10),
      })),
    };
  }

  async joinCourse(userId: string, code: string) {
    const rows = await this.courseRepo.query(
      `SELECT id, course_id AS "courseId", group_id AS "groupId", status,
              valid_from AS "validFrom", valid_until AS "validUntil",
              used_by_user_id AS "usedByUserId"
       FROM access_codes WHERE code = $1 LIMIT 1`,
      [(code ?? '').trim().toUpperCase()],
    );
    if (!rows.length) throw new BadRequestException('Neplatný kód');
    const rec = rows[0];

    if (rec.status === 'revoked') throw new BadRequestException('Kód byl zneplatněn');
    if (rec.status === 'used') {
      if (rec.usedByUserId === userId) return;
      throw new BadRequestException('Tento kód byl již použit');
    }

    const now = new Date();
    if (rec.validFrom && new Date(rec.validFrom) > now) throw new BadRequestException('Kód zatím neplatí');
    if (rec.validUntil && new Date(rec.validUntil) < now) throw new BadRequestException('Platnost kódu vypršela');

    await this.courseRepo.query(
      `INSERT INTO user_course_assignments (user_id, course_id)
       VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING`,
      [userId, rec.courseId],
    );

    if (rec.groupId) {
      await this.courseRepo.query(
        `INSERT INTO user_group_members (group_id, user_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [rec.groupId, userId],
      );
    }

    await this.courseRepo.query(
      `UPDATE access_codes SET status = 'used', used_by_user_id = $1, used_at = NOW() WHERE id = $2`,
      [userId, rec.id],
    );
  }
}
