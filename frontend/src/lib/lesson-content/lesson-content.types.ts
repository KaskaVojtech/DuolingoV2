export type BlockType = 'content' | 'exercise' | 'mix';
export type BlockLockMode = 'toggle' | 'scheduled' | 'constraint';

export interface ContentBlockAttributes {
  requiresReadConfirmation: boolean;
}

export interface ExerciseBlockAttributes {
  isMandatory: boolean;
}

export type BlockConstraintCondition =
  | { type: 'content_read' }
  | { type: 'exercise_completed'; mandatory: boolean };

export interface BlockConstraintRule {
  id: string;
  sourceBlockId: string;
  sourceBlockTitle: string;
  sourceBlockType: BlockType;
  condition: BlockConstraintCondition;
}

export interface BlockConstraintGroup {
  id: string;
  rules: BlockConstraintRule[];
}

export interface BlockLockConfig {
  mode: BlockLockMode;
  isLocked: boolean;
  unlockAt?: string | null;
  lockAt?: string | null;
  constraintGroups: BlockConstraintGroup[];
}

export interface Block {
  id: string;
  lessonId: string;
  title: string;
  type: BlockType;
  order: number;
  isLocked: boolean;
  lockConfig: BlockLockConfig;
  contentAttributes?: ContentBlockAttributes;
  exerciseAttributes?: ExerciseBlockAttributes;
  createdAt: string;
  updatedAt: string;
}

export interface BlockConstraintImpact {
  affectedBlockId: string;
  affectedBlockTitle: string;
  constraintRuleId: string;
  isAutoResolvable: boolean;
  autoResolveDescription?: string;
}
