export type CourseVisibility = 'public' | 'private';
export type AccessType = 'code' | 'email';
export type AccessStatus = 'active' | 'inactive' | 'expired' | 'never_used';
export type SortField = 'email' | 'status' | 'created_at' | 'last_login_at';
export type SortDirection = 'asc' | 'desc';

export interface CourseSettings {
  courseId: string;
  courseTitle: string;
  visibility: CourseVisibility;
  thumbnailColor: string;
  thumbnailUrl: string | null;
}

export interface AccessRecord {
  id: string;
  type: AccessType;
  code?: string;
  email?: string;
  status: AccessStatus;
  validFrom: string | null;
  validUntil: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  usedByEmail?: string;
}

export interface GenerateCodesPayload {
  count: number;
  validityDays: number;
  validFrom: string | null;
  validUntil: string | null;
}

export interface AddEmailsPayload {
  emails: string[];
  validityDays: number;
  validFrom: string | null;
  validUntil: string | null;
}

export interface TableFilter {
  searchQuery: string;
  sortField: SortField;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalPages: number;
  totalCount: number;
}
