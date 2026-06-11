export interface LessonListItem {
  id: string;
  title: string;
  isTemplate: boolean;
  courseIds: string[];
  courseTitles: string[];
  isLocked: boolean;
  lockMode: 'toggle' | 'scheduled' | 'constraint';
  accessFrom: string | null;
  accessUntil: string | null;
  blocksCount: number;
  createdAt: string;
  updatedAt: string;
  completionAvg: number;
}

export interface LessonStats {
  lessonId: string;
  completionStats: {
    average: number;
    median: number;
    mode: number;
    totalUsers: number;
    completedUsers: number;
    distribution: Array<{ bucket: number; count: number }>;
  };
  exerciseStats: Array<{
    blockId: string;
    blockTitle: string;
    blockType: 'exercise';
    isMandatory: boolean;
    attemptCount: number;
    uniqueUsers: number;
    successRate: number;
    averageScore: number;
    repeatRate: number;
    itemStats?: Array<{
      itemId: string;
      itemType: string;
      successRate: number;
      attemptCount: number;
    }>;
  }>;
  contentBlockStats: Array<{
    blockId: string;
    blockTitle: string;
    blockType: 'content';
    averageReadTime: number;
    medianReadTime: number;
    readConfirmationRate: number;
    viewCount: number;
  }>;
}

export interface LessonsFilter {
  searchQuery: string;
  courseId: string | null;
  isTemplate: boolean | null;
  isLocked: boolean | null;
  sortField: 'title' | 'updatedAt' | 'createdAt' | 'completionAvg';
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface UserCompletionFilter {
  minPercent: number;
  maxPercent: number;
}

export interface UserCompletionRecord {
  userId: string;
  email: string;
  completionPercent: number;
  lastActivityAt: string | null;
}

export interface LessonLockConfig {
  isLocked: boolean;
  lockMode: 'toggle' | 'scheduled' | 'constraint';
  accessFrom: string | null;
  accessUntil: string | null;
}
