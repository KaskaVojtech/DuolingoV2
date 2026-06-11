export type CompletionMode = 'manual_button' | 'blocks_completion';
export type BlockScope = 'exercise' | 'content' | 'both';
export type LockMode = 'toggle' | 'scheduled' | 'constraint';
export type ConstraintThreshold = 'full' | 'partial';

export interface ConstraintRule {
  id: string;
  sourceLessonId: string;
  sourceLessonTitle: string;
  threshold: ConstraintThreshold;
  partialCount?: number;
}

export interface ConstraintGroup {
  id: string;
  rules: ConstraintRule[];
}

export interface LessonLockConfig {
  mode: LockMode;
  isLocked: boolean;
  unlockAt?: string | null;
  lockAt?: string | null;
  constraintGroups: ConstraintGroup[];
}

export interface LessonCompletion {
  mode: CompletionMode;
  blockScope?: BlockScope;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  isLocked: boolean;
  lockConfig: LessonLockConfig;
  completion: LessonCompletion;
  blocksCount: number;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConstraintImpact {
  affectedLessonId: string;
  affectedLessonTitle: string;
  constraintRuleId: string;
  isAutoResolvable: boolean;
  autoResolveDescription?: string;
}
