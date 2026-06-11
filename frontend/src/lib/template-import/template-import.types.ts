export interface LessonTemplate {
  id: string;
  title: string;
  blocksCount: number;
  exerciseBlocksCount: number;
  contentBlocksCount: number;
  usedInCourses: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateBlock {
  id: string;
  title: string;
  type: 'content' | 'exercise';
  isMandatory?: boolean;
  requiresReadConfirmation?: boolean;
}

export interface CourseLesson {
  id: string;
  title: string;
  order: number;
  isLocked: boolean;
  blocksCount: number;
}

export type ImportPhase = 'selecting' | 'placing';

export interface DropZone {
  afterOrder: number;
}
