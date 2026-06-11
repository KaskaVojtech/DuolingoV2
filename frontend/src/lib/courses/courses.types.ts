export type ViewMode = 'grid-large' | 'grid-small' | 'list';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  thumbnailColor: string;
  lessonsCount: number;
  updatedAt: string;
  isTemplate: boolean;
}

export interface CourseTemplate {
  id: string;
  name: string;
  sourceCourseid: string;
  createdAt: string;
}

export interface SaveAsTemplatePayload {
  courseId: string;
  templateName: string;
}
