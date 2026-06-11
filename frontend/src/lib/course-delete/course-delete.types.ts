export interface LessonDeletePreview {
  id: string;
  title: string;
  blocksCount: number;
  isTemplate: boolean;
  willBeDeleted: boolean;
}

export interface CourseDeletePreview {
  courseId: string;
  courseTitle: string;
  activeAccessCount: number;
  totalAccessCount: number;
  lessons: LessonDeletePreview[];
  scheduledDeleteAt: string;
}

export interface CourseDeletePayload {
  courseId: string;
  preserveLessonIds: string[];
}

export interface CourseDeleteResult {
  courseTitle: string;
  scheduledDeleteAt: string;
  preservedLessonsCount: number;
}
