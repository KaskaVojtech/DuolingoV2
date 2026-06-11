/**
 * Lesson domain logic: listing and filtering, block ordering, templates, locks and statistics.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { BlocksService } from '../blocks/blocks.service';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    private readonly blocksService: BlocksService,
  ) {}

  private toResponse(lesson: Lesson, blocksCount = 0) {
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      order: lesson.orderIndex,
      isLocked: lesson.isLocked,
      lockConfig: lesson.lockConfig,
      completion: lesson.completion,
      blocksCount,
      isTemplate: lesson.isTemplate,
      createdAt: lesson.createdAt.toISOString(),
      updatedAt: lesson.updatedAt.toISOString(),
    };
  }

  async findAll(filter: {
    searchQuery?: string;
    courseId?: string | null;
    isTemplate?: boolean | null;
    isLocked?: boolean | null;
    sortField?: string;
    sortDirection?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: any[]; totalPages: number; totalCount: number }> {
    const searchQuery = filter.searchQuery ?? '';
    const page = filter.page ?? 1;
    const pageSize = filter.pageSize ?? 20;
    const offset = (page - 1) * pageSize;
    const sortField = filter.sortField ?? 'updated_at';
    const sortDirection = (filter.sortDirection ?? 'desc').toUpperCase();

    const params: any[] = [searchQuery, pageSize, offset];
    let whereExtra = '';
    let paramIndex = 4;

    if (filter.courseId !== undefined && filter.courseId !== null) {
      whereExtra += ` AND l.course_id = $${paramIndex}`;
      params.push(filter.courseId);
      paramIndex++;
    }
    if (filter.isTemplate !== undefined && filter.isTemplate !== null) {
      whereExtra += ` AND l.is_template = $${paramIndex}`;
      params.push(filter.isTemplate);
      paramIndex++;
    }
    if (filter.isLocked !== undefined && filter.isLocked !== null) {
      whereExtra += ` AND l.is_locked = $${paramIndex}`;
      params.push(filter.isLocked);
      paramIndex++;
    }

    const allowedSort: Record<string, string> = {
      title: 'l.title',
      updatedAt: 'l.updated_at',
      createdAt: 'l.created_at',
      updated_at: 'l.updated_at',
      created_at: 'l.created_at',
    };
    const sortCol = allowedSort[sortField] ?? 'l.updated_at';
    const sortDir = sortDirection === 'ASC' ? 'ASC' : 'DESC';

    const rows = await this.lessonRepo.query(
      `SELECT l.*,
        co.title as course_title,
        COALESCE(b.cnt, 0)::int as blocks_count
      FROM lessons l
      LEFT JOIN courses co ON co.id = l.course_id
      LEFT JOIN (SELECT lesson_id, COUNT(*) as cnt FROM blocks GROUP BY lesson_id) b ON b.lesson_id = l.id
      WHERE ($1 = '' OR l.title ILIKE '%' || $1 || '%')
      ${whereExtra}
      ORDER BY ${sortCol} ${sortDir}
      LIMIT $2 OFFSET $3`,
      params,
    );

    const countParams: any[] = [searchQuery];
    let countParamIndex = 2;
    let countWhereExtra = '';

    if (filter.courseId !== undefined && filter.courseId !== null) {
      countWhereExtra += ` AND l.course_id = $${countParamIndex}`;
      countParams.push(filter.courseId);
      countParamIndex++;
    }
    if (filter.isTemplate !== undefined && filter.isTemplate !== null) {
      countWhereExtra += ` AND l.is_template = $${countParamIndex}`;
      countParams.push(filter.isTemplate);
      countParamIndex++;
    }
    if (filter.isLocked !== undefined && filter.isLocked !== null) {
      countWhereExtra += ` AND l.is_locked = $${countParamIndex}`;
      countParams.push(filter.isLocked);
      countParamIndex++;
    }

    const countRows = await this.lessonRepo.query(
      `SELECT COUNT(*)::int as total FROM lessons l
       WHERE ($1 = '' OR l.title ILIKE '%' || $1 || '%')
       ${countWhereExtra}`,
      countParams,
    );
    const totalCount = countRows[0]?.total ?? 0;

    const items = rows.map((row: any) => ({
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      isTemplate: row.is_template,
      courseIds: row.course_id ? [row.course_id] : [],
      courseTitles: row.course_title ? [row.course_title] : [],
      isLocked: row.is_locked,
      lockMode: row.lock_config?.mode ?? 'toggle',
      accessFrom: null,
      accessUntil: null,
      blocksCount: row.blocks_count,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
      updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
      completionAvg: 0,
    }));

    return {
      items,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
    };
  }

  async findTemplates(): Promise<any[]> {
    const rows = await this.lessonRepo.query(`
      SELECT
        l.id, l.title, l.created_at, l.updated_at,
        COALESCE(b.total, 0)::int     AS blocks_count,
        COALESCE(b.exercise, 0)::int  AS exercise_blocks_count,
        COALESCE(b.content, 0)::int   AS content_blocks_count,
        COALESCE(cu.course_ids, '{}') AS used_in_courses
      FROM lessons l
      LEFT JOIN (
        SELECT lesson_id,
               COUNT(*)                                    AS total,
               COUNT(*) FILTER (WHERE type = 'exercise')  AS exercise,
               COUNT(*) FILTER (WHERE type = 'content')   AS content
        FROM blocks GROUP BY lesson_id
      ) b ON b.lesson_id = l.id
      LEFT JOIN (
        SELECT course_id, ARRAY_AGG(id::text) AS course_ids
        FROM lessons WHERE course_id IS NOT NULL GROUP BY course_id
      ) cu ON cu.course_id = l.id
      WHERE l.is_template = TRUE
      ORDER BY l.updated_at DESC
    `);
    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      blocksCount: r.blocks_count,
      exerciseBlocksCount: r.exercise_blocks_count,
      contentBlocksCount: r.content_blocks_count,
      usedInCourses: r.used_in_courses ?? [],
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
      updatedAt: r.updated_at instanceof Date ? r.updated_at.toISOString() : r.updated_at,
    }));
  }

  async findForImport(excludeLessonId: string): Promise<{ id: string; title: string; courseTitle: string; wordCount: number }[]> {
    const rows = await this.lessonRepo.query(
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

  async findById(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepo.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException(`Lesson ${id} not found`);
    return lesson;
  }

  async update(id: string, patch: any): Promise<void> {
    const lesson = await this.findById(id);
    Object.assign(lesson, patch);
    await this.lessonRepo.save(lesson);
  }

  async delete(id: string): Promise<void> {
    const lesson = await this.findById(id);
    await this.lessonRepo.remove(lesson);
  }

  async saveAsTemplate(id: string, templateName?: string): Promise<void> {
    const lesson = await this.findById(id);
    if (templateName) lesson.title = templateName;
    lesson.isTemplate = true;
    lesson.courseId = null;
    await this.lessonRepo.save(lesson);
  }

  async resolveTemplateId(lessonId: string): Promise<string> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    return lesson?.templateId ?? lessonId;
  }

  async getBlocks(lessonId: string): Promise<any[]> {
    const effectiveId = await this.resolveTemplateId(lessonId);
    return this.blocksService.findByLessonIdMapped(effectiveId);
  }

  async createMixBlock(lessonId: string, title?: string): Promise<any> {
    const effectiveId = await this.resolveTemplateId(lessonId);
    const block = await this.blocksService.create(effectiveId, 'mix', title);
    return this.blocksService.findById(block.id);
  }

  async reorderBlocks(lessonId: string, orderedIds: string[]): Promise<void> {
    const effectiveId = await this.resolveTemplateId(lessonId);
    return this.blocksService.reorder(effectiveId, orderedIds);
  }

  async getInfo(lessonId: string): Promise<{ lessonTitle: string; courseId: string | null; courseTitle: string }> {
    const rows = await this.lessonRepo.query(
      `SELECT l.title as lesson_title, l.course_id, co.title as course_title
       FROM lessons l
       LEFT JOIN courses co ON co.id = l.course_id
       WHERE l.id = $1`,
      [lessonId],
    );
    if (!rows.length) throw new NotFoundException(`Lesson ${lessonId} not found`);
    return {
      lessonTitle: rows[0].lesson_title,
      courseId: rows[0].course_id,
      courseTitle: rows[0].course_title ?? '',
    };
  }

  async getStats(lessonId: string): Promise<any> {
    return {
      lessonId,
      completionStats: {
        average: 0,
        median: 0,
        mode: 0,
        totalUsers: 0,
        completedUsers: 0,
        distribution: [],
      },
      exerciseStats: [],
      contentBlockStats: [],
    };
  }

  async updateLock(lessonId: string, config: any): Promise<void> {
    const lesson = await this.findById(lessonId);
    if (config.isLocked !== undefined) lesson.isLocked = config.isLocked;
    if (config.lockConfig !== undefined) lesson.lockConfig = config.lockConfig;
    await this.lessonRepo.save(lesson);
  }

  async getUsers(lessonId: string, minPercent: number, maxPercent: number): Promise<any[]> {
    return [];
  }

  async findByCourseId(courseId: string): Promise<any[]> {
    if (!courseId) return [];
    const rows = await this.lessonRepo.query(
      `SELECT l.*, COUNT(b.id)::int AS blocks_count
       FROM lessons l
       LEFT JOIN blocks b ON b.lesson_id = l.id
       WHERE l.course_id = $1
       GROUP BY l.id
       ORDER BY l.order_index ASC`,
      [courseId],
    );
    return rows.map((row: any) => ({
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      order: row.order_index,
      isLocked: row.is_locked,
      lockConfig: row.lock_config,
      completion: row.completion,
      blocksCount: row.blocks_count ?? 0,
      isTemplate: row.is_template,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async create(courseId: string, title: string): Promise<Lesson> {
    const maxResult = await this.lessonRepo
      .createQueryBuilder('l')
      .select('MAX(l.orderIndex)', 'max')
      .where('l.courseId = :courseId', { courseId })
      .getRawOne();

    const maxOrder = maxResult?.max ?? -1;
    const lesson = this.lessonRepo.create({
      courseId,
      title,
      orderIndex: maxOrder + 1,
    });
    return this.lessonRepo.save(lesson);
  }

  async reorderInCourse(courseId: string, orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.lessonRepo.update({ id: orderedIds[i], courseId }, { orderIndex: i });
    }
  }

  async importTemplates(courseId: string, templateIds: string[], afterOrder: number): Promise<void> {
    for (let i = 0; i < templateIds.length; i++) {
      const template = await this.lessonRepo.findOne({ where: { id: templateIds[i] } });
      if (!template) continue;
      const newLesson = this.lessonRepo.create({
        courseId,
        title: template.title,
        isTemplate: false,
        templateId: template.id,
        isLocked: template.isLocked,
        lockConfig: template.lockConfig,
        completion: template.completion,
        orderIndex: afterOrder + i + 1,
      });
      await this.lessonRepo.save(newLesson);
    }
  }
}
