export interface Group {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  memberCount?: number;
}

export interface GroupMember {
  userId: string;
  email: string;
  addedAt: string;
}

export interface GroupDetail extends Group {
  members: GroupMember[];
}

export interface GroupUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface GroupCourseAssignment {
  id: string;
  courseId: string;
  courseTitle: string;
  thumbnailColor: string;
  assignedAt: string;
}

export const GROUP_COLOR_PRESETS = [
  '#4f6ef7',
  '#22c55e',
  '#f59e0b',
  '#e55353',
  '#a855f7',
  '#14b8a6',
  '#f97316',
  '#64748b',
] as const;
