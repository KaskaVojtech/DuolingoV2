/**
 * Access code logic: generation, validity, redemption and revocation.
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessCode } from './entities/access-code.entity';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(AccessCode)
    private readonly codeRepo: Repository<AccessCode>,
  ) {}

  private generateCode(length = 8): string {
    let s = '';
    for (let i = 0; i < length; i++) {
      s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    return s;
  }

  async generateCodes(
    courseId: string,
    groupId: string | null,
    count: number,
    validFrom: string | null,
    validUntil: string | null,
  ): Promise<any[]> {
    if (!courseId) throw new BadRequestException('Chybí kurz');
    const n = Math.min(Math.max(Number(count) || 1, 1), 200);

    const created: any[] = [];
    for (let i = 0; i < n; i++) {
      let inserted: any[] = [];
      for (let attempt = 0; attempt < 6 && inserted.length === 0; attempt++) {
        const code = this.generateCode();
        inserted = await this.codeRepo.query(
          `INSERT INTO access_codes (code, course_id, group_id, valid_from, valid_until)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (code) DO NOTHING
           RETURNING id, code`,
          [code, courseId, groupId, validFrom, validUntil],
        );
      }
      if (inserted.length) created.push({ id: inserted[0].id, code: inserted[0].code });
    }
    return created;
  }

  async listCodes(query: any = {}): Promise<any[]> {
    const params: any[] = [];
    const where: string[] = [];

    if (query.courseId) {
      params.push(query.courseId);
      where.push(`ac.course_id = $${params.length}`);
    }
    if (query.groupId) {
      params.push(query.groupId);
      where.push(`ac.group_id = $${params.length}`);
    }
    if (query.status) {
      params.push(query.status);
      where.push(`ac.status = $${params.length}`);
    }
    if (query.search && String(query.search).trim()) {
      params.push(`%${String(query.search).trim()}%`);
      where.push(`(ac.code ILIKE $${params.length} OR c.title ILIKE $${params.length})`);
    }

    const rows = await this.codeRepo.query(
      `SELECT ac.id, ac.code, ac.status,
              ac.valid_from  AS "validFrom",
              ac.valid_until AS "validUntil",
              ac.used_at     AS "usedAt",
              ac.created_at  AS "createdAt",
              ac.course_id   AS "courseId", c.title AS "courseTitle",
              ac.group_id    AS "groupId",  g.name  AS "groupName",
              u.email        AS "usedByEmail"
       FROM access_codes ac
       JOIN courses c     ON c.id = ac.course_id
       LEFT JOIN user_groups g ON g.id = ac.group_id
       LEFT JOIN users u  ON u.id = ac.used_by_user_id
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY ac.created_at DESC`,
      params,
    );
    return rows;
  }

  async revokeCode(id: string): Promise<void> {
    const res = await this.codeRepo.query(
      `UPDATE access_codes SET status = 'revoked' WHERE id = $1 AND status = 'active'`,
      [id],
    );
    void res;
  }

  async grantUser(email: string, courseId: string): Promise<{ email: string; courseId: string }> {
    const mail = (email ?? '').trim();
    if (!mail || !courseId) throw new BadRequestException('Chybí e-mail nebo kurz');

    const users = await this.codeRepo.query(
      `SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [mail],
    );
    if (!users.length) {
      throw new NotFoundException('Uživatel s tímto e-mailem neexistuje. Vygeneruj raději přístupový kód.');
    }

    await this.codeRepo.query(
      `INSERT INTO user_course_assignments (user_id, course_id)
       VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING`,
      [users[0].id, courseId],
    );
    return { email: mail, courseId };
  }

  async listUserGrants(query: any = {}): Promise<any[]> {
    const params: any[] = [];
    const where: string[] = [];

    if (query.courseId) {
      params.push(query.courseId);
      where.push(`uca.course_id = $${params.length}`);
    }
    if (query.search && String(query.search).trim()) {
      params.push(`%${String(query.search).trim()}%`);
      where.push(`(u.email ILIKE $${params.length} OR c.title ILIKE $${params.length})`);
    }

    return this.codeRepo.query(
      `SELECT uca.id,
              uca.assigned_at AS "assignedAt",
              u.id    AS "userId", u.email AS "email",
              c.id    AS "courseId", c.title AS "courseTitle"
       FROM user_course_assignments uca
       JOIN users u   ON u.id = uca.user_id
       JOIN courses c ON c.id = uca.course_id
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY uca.assigned_at DESC`,
      params,
    );
  }

  async revokeUserGrant(id: string): Promise<void> {
    await this.codeRepo.query(`DELETE FROM user_course_assignments WHERE id = $1`, [id]);
  }
}
