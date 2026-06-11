/**
 * Group logic: user membership and assigning courses to groups.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGroup } from './entities/user-group.entity';
import { UserGroupMember } from './entities/user-group-member.entity';
import { GroupCourseAssignment } from './entities/group-course-assignment.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly groupRepo: Repository<UserGroup>,
    @InjectRepository(UserGroupMember)
    private readonly memberRepo: Repository<UserGroupMember>,
    @InjectRepository(GroupCourseAssignment)
    private readonly courseAssignRepo: Repository<GroupCourseAssignment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    const groups = await this.groupRepo.find({ order: { createdAt: 'ASC' } });
    const counts = await this.memberRepo
      .createQueryBuilder('m')
      .select('m.groupId', 'groupId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('m.groupId')
      .getRawMany();
    const countMap = Object.fromEntries(counts.map((r) => [r.groupId, parseInt(r.count, 10)]));
    return groups.map((g) => ({ ...this.toResponse(g), memberCount: countMap[g.id] ?? 0 }));
  }

  async findById(id: string) {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException(`Group ${id} not found`);

    const members = await this.memberRepo
      .createQueryBuilder('m')
      .innerJoin(User, 'u', 'u.id = m.userId')
      .select(['m.userId as "userId"', 'u.email as email', 'm.addedAt as "addedAt"'])
      .where('m.groupId = :id', { id })
      .orderBy('m.addedAt', 'ASC')
      .getRawMany();

    return {
      ...this.toResponse(group),
      members: members.map((m) => ({ userId: m.userId, email: m.email, addedAt: m.addedAt })),
    };
  }

  async create(name: string, color: string) {
    const group = this.groupRepo.create({ name, color });
    const saved = await this.groupRepo.save(group);
    return { ...this.toResponse(saved), memberCount: 0 };
  }

  async update(id: string, patch: { name?: string; color?: string }) {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException(`Group ${id} not found`);
    if (patch.name !== undefined) group.name = patch.name;
    if (patch.color !== undefined) group.color = patch.color;
    await this.groupRepo.save(group);
  }

  async delete(id: string) {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException(`Group ${id} not found`);
    await this.groupRepo.remove(group);
  }

  async addMember(groupId: string, userId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException(`Group ${groupId} not found`);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    const existing = await this.memberRepo.findOne({ where: { groupId, userId } });
    if (existing) return;
    await this.memberRepo.save(this.memberRepo.create({ groupId, userId }));
  }

  async removeMember(groupId: string, userId: string) {
    await this.memberRepo.delete({ groupId, userId });
  }

  async searchUsers(search: string) {
    const q = this.userRepo.createQueryBuilder('u').orderBy('u.email', 'ASC').take(30);
    if (search) q.where('u.email ILIKE :s', { s: `%${search}%` });
    const users = await q.getMany();
    return users.map((u) => ({ id: u.id, email: u.email, role: u.role }));
  }

  async getGroupCourses(groupId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException(`Group ${groupId} not found`);
    const rows = await this.courseAssignRepo.query(
      `SELECT gca.id, gca.course_id, gca.assigned_at, c.title, c.thumbnail_color
       FROM group_course_assignments gca
       JOIN courses c ON c.id = gca.course_id
       WHERE gca.group_id = $1
       ORDER BY gca.assigned_at DESC`,
      [groupId],
    );
    return rows.map((r: any) => ({
      id: r.id,
      courseId: r.course_id,
      courseTitle: r.title,
      thumbnailColor: r.thumbnail_color,
      assignedAt: r.assigned_at,
    }));
  }

  async assignCourse(groupId: string, courseId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException(`Group ${groupId} not found`);
    const existing = await this.courseAssignRepo.findOne({ where: { groupId, courseId } });
    if (existing) return;
    await this.courseAssignRepo.save(this.courseAssignRepo.create({ groupId, courseId }));
  }

  async unassignCourse(groupId: string, courseId: string) {
    await this.courseAssignRepo.delete({ groupId, courseId });
  }

  private toResponse(g: UserGroup) {
    return { id: g.id, name: g.name, color: g.color, createdAt: g.createdAt.toISOString() };
  }
}
