export type ThumbnailType = 'image' | 'color';

export interface CourseCreatePayload {
  title: string;
  description: string;
  thumbnailType: ThumbnailType;
  thumbnailUrl: string | null;
  thumbnailColor: string;
  accessMode: 'toggle' | 'scheduled';
  isLocked: boolean;
  accessFrom: string | null;
  accessUntil: string | null;
}

export interface CourseCreateResult {
  id: string;
  title: string;
}
