export interface UserDetail {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface UserCourseAccess {
  accessId: string;
  courseId: string;
  courseTitle: string;
  thumbnailColor: string;
  type: 'email' | 'code';
  code: string | null;
  status: string;
  validFrom: string | null;
  validUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}
