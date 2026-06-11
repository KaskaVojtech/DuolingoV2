/**
 * Course domain logic: queries, filtering, appearance (color/image) and soft-delete.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  private toResponse(course: Course, lessonsCount = 0) {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      thumbnailColor: course.thumbnailColor,
      visibility: course.visibility,
      isLocked: course.isLocked,
      lockMode: course.lockMode,
      accessFrom: course.accessFrom ? course.accessFrom.toISOString() : null,
      accessUntil: course.accessUntil ? course.accessUntil.toISOString() : null,
      isTemplate: course.isTemplate,
      lessonsCount,
      updatedAt: course.updatedAt.toISOString(),
      createdAt: course.createdAt.toISOString(),
    };
  }

  async findAll(): Promise<any[]> {
    const rows = await this.courseRepo.query(`
      SELECT c.*, COALESCE(l.cnt, 0)::int as lessons_count
      FROM courses c
      LEFT JOIN (SELECT course_id, COUNT(*) as cnt FROM lessons GROUP BY course_id) l ON l.course_id = c.id
      WHERE c.deleted_at IS NULL
      ORDER BY c.updated_at DESC
    `);
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      thumbnailUrl: row.thumbnail_url,
      thumbnailColor: row.thumbnail_color,
      visibility: row.visibility,
      isLocked: row.is_locked,
      lockMode: row.lock_mode,
      accessFrom: row.access_from,
      accessUntil: row.access_until,
      isTemplate: row.is_template,
      lessonsCount: row.lessons_count,
      updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    }));
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    return course;
  }

  async create(dto: any): Promise<{ id: string; title: string }> {
    const course = this.courseRepo.create({
      title: dto.title,
      description: dto.description ?? '',
      thumbnailUrl: dto.thumbnailUrl ?? null,
      thumbnailColor: dto.thumbnailColor ?? '#4f6ef7',
      visibility: dto.visibility ?? 'private',
      isLocked: dto.isLocked ?? false,
      lockMode: dto.lockMode ?? 'toggle',
      accessFrom: dto.accessFrom ?? null,
      accessUntil: dto.accessUntil ?? null,
      isTemplate: dto.isTemplate ?? false,
    });
    const saved = await this.courseRepo.save(course);
    return { id: saved.id, title: saved.title };
  }

  async update(id: string, dto: any): Promise<void> {
    const course = await this.findOne(id);
    Object.assign(course, dto);
    await this.courseRepo.save(course);
  }

  async saveAsTemplate(
    id: string,
    templateName: string,
  ): Promise<{ id: string; name: string; sourceCourseId: string; createdAt: string }> {
    const source = await this.findOne(id);
    const template = this.courseRepo.create({
      title: templateName,
      description: source.description,
      thumbnailUrl: source.thumbnailUrl,
      thumbnailColor: source.thumbnailColor,
      visibility: source.visibility,
      isLocked: source.isLocked,
      lockMode: source.lockMode,
      isTemplate: true,
    });
    const saved = await this.courseRepo.save(template);
    return {
      id: saved.id,
      name: saved.title,
      sourceCourseId: id,
      createdAt: saved.createdAt.toISOString(),
    };
  }

  async getSettings(id: string): Promise<{ courseId: string; courseTitle: string; visibility: string; thumbnailColor: string; thumbnailUrl: string | null }> {
    const course = await this.findOne(id);
    return {
      courseId: course.id,
      courseTitle: course.title,
      visibility: course.visibility,
      thumbnailColor: course.thumbnailColor,
      thumbnailUrl: course.thumbnailUrl,
    };
  }

  async getDeletePreview(courseId: string): Promise<any> {
    const course = await this.findOne(courseId);

    const accessCounts = await this.courseRepo.query(
      `SELECT COUNT(DISTINCT user_id)::int AS total_count FROM (
         SELECT user_id FROM user_course_assignments WHERE course_id = $1
         UNION
         SELECT ugm.user_id
           FROM group_course_assignments gca
           JOIN user_group_members ugm ON ugm.group_id = gca.group_id
          WHERE gca.course_id = $1
       ) t`,
      [courseId],
    );

    const lessonRows = await this.courseRepo.query(
      `SELECT l.id, l.title, l.is_template,
              COALESCE(b.cnt, 0)::int AS blocks_count
       FROM lessons l
       LEFT JOIN (SELECT lesson_id, COUNT(*) AS cnt FROM blocks GROUP BY lesson_id) b
         ON b.lesson_id = l.id
       WHERE l.course_id = $1
       ORDER BY l.order_index`,
      [courseId],
    );

    const scheduledDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const scheduledDeleteAt = scheduledDate.toLocaleDateString('cs-CZ');

    return {
      courseId,
      courseTitle: course.title,
      activeAccessCount: accessCounts[0]?.total_count ?? 0,
      totalAccessCount: accessCounts[0]?.total_count ?? 0,
      lessons: lessonRows.map((l: any) => ({
        id: l.id,
        title: l.title,
        blocksCount: l.blocks_count,
        isTemplate: l.is_template,
        willBeDeleted: !l.is_template,
      })),
      scheduledDeleteAt,
    };
  }

  async deleteCourse(
    courseId: string,
    preserveLessonIds: string[],
  ): Promise<{ courseTitle: string; scheduledDeleteAt: string; preservedLessonsCount: number }> {
    const course = await this.findOne(courseId);

    await this.courseRepo.query(
      `UPDATE lessons SET course_id = NULL WHERE course_id = $1 AND is_template = TRUE`,
      [courseId],
    );

    if (preserveLessonIds.length > 0) {
      await this.courseRepo.query(
        `UPDATE lessons SET course_id = NULL, is_template = TRUE
         WHERE id = ANY($1::uuid[]) AND course_id = $2`,
        [preserveLessonIds, courseId],
      );
    }

    const scheduledDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.courseRepo.query(
      `UPDATE courses SET deleted_at = NOW(), scheduled_delete_at = $2 WHERE id = $1`,
      [courseId, scheduledDate.toISOString()],
    );

    return {
      courseTitle: course.title,
      scheduledDeleteAt: scheduledDate.toLocaleDateString('cs-CZ'),
      preservedLessonsCount: preserveLessonIds.length,
    };
  }

  async findDeleted(query: any = {}): Promise<any[]> {

    await this.courseRepo.query(
      `DELETE FROM courses WHERE deleted_at IS NOT NULL
         AND scheduled_delete_at IS NOT NULL AND scheduled_delete_at <= NOW()`,
    );

    const search = typeof query.search === 'string' ? query.search.trim() : '';
    const sortMap: Record<string, string> = {
      title_asc:    'c.title ASC',
      title_desc:   'c.title DESC',
      deleted_desc: 'c.deleted_at DESC',
      deleted_asc:  'c.deleted_at ASC',
    };
    const orderBy = sortMap[query.sort] ?? sortMap.deleted_desc;

    const params: any[] = [];
    let where = 'c.deleted_at IS NOT NULL';
    if (search) {
      params.push(`%${search}%`);
      where += ` AND c.title ILIKE $${params.length}`;
    }

    const rows = await this.courseRepo.query(
      `SELECT c.*, COALESCE(l.cnt, 0)::int as lessons_count
       FROM courses c
       LEFT JOIN (SELECT course_id, COUNT(*) as cnt FROM lessons GROUP BY course_id) l ON l.course_id = c.id
       WHERE ${where}
       ORDER BY ${orderBy}`,
      params,
    );

    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      thumbnailUrl: row.thumbnail_url,
      thumbnailColor: row.thumbnail_color,
      isTemplate: row.is_template,
      lessonsCount: row.lessons_count,
      deletedAt: row.deleted_at instanceof Date ? row.deleted_at.toISOString() : row.deleted_at,
      scheduledDeleteAt:
        row.scheduled_delete_at instanceof Date
          ? row.scheduled_delete_at.toISOString()
          : row.scheduled_delete_at,
    }));
  }

  async restoreCourse(courseId: string): Promise<{ id: string; title: string }> {
    const course = await this.findOne(courseId);
    await this.courseRepo.query(
      `UPDATE courses SET deleted_at = NULL, scheduled_delete_at = NULL WHERE id = $1`,
      [courseId],
    );
    return { id: course.id, title: course.title };
  }

  async purgeCourse(courseId: string): Promise<{ id: string }> {
    await this.findOne(courseId);
    await this.courseRepo.delete(courseId);
    return { id: courseId };
  }
}
