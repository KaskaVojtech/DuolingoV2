import { z } from 'zod';

export const TextComponentSchema = z.object({
  type: z.literal('text'),
  value: z.string(),
});

export const InputComponentSchema = z.object({
  type: z.literal('input'),
  id: z.string().uuid(),
  correct: z.string(),
  acceptAlso: z.array(z.string()).optional(),
  hint: z.string().optional(),
  evaluation: z.enum(['auto', 'teacher']),
});

export const SelectComponentSchema = z.object({
  type: z.literal('select'),
  id: z.string().uuid(),
  options: z.array(z.string()).min(2),
  correct: z.string(),
});

export const SelectBetweenComponentSchema = z.object({
  type: z.literal('select_between'),
  id: z.string().uuid(),
  options: z.array(z.string()).min(2),
  correct: z.string(),
});

export const DragTargetComponentSchema = z.object({
  type: z.literal('drag_target'),
  id: z.string().uuid(),
  sourceId: z.string().uuid(),
  correct: z.string(),
});

export const ImageComponentSchema = z.object({
  type: z.literal('image'),
  id: z.string().uuid(),
  url: z.string().url(),
  caption: z.string().optional(),
});

export const AudioComponentSchema = z.object({
  type: z.literal('audio'),
  id: z.string().uuid(),
  url: z.string().url(),
  title: z.string().optional(),
});

export const VideoComponentSchema = z.object({
  type: z.literal('video'),
  id: z.string().uuid(),
  url: z.string().url(),
  title: z.string().optional(),
});

export const AnswerComponentSchema = z.object({
  type: z.literal('answer'),
  id: z.string().uuid(),
  length: z.enum(['short', 'long']),
  evaluation: z.enum(['auto', 'teacher']),
  placeholder: z.string().optional(),
});

export const McOptionSchema = z.object({
  id: z.string().uuid(),
  value: z.string().min(1),
  correct: z.boolean(),
});

export const McComponentSchema = z.object({
  type: z.literal('mc'),
  id: z.string().uuid(),
  question: z.string().min(1),
  options: z.array(McOptionSchema).min(2),
  multiple: z.boolean(),
});

export const HighlightNodeSchema = z.union([
  z.object({ type: z.literal('text'), value: z.string() }),
  z.object({ type: z.literal('word'), value: z.string(), correct: z.boolean() }),
]);

export const HighlightComponentSchema = z.object({
  type: z.literal('highlight'),
  id: z.string().uuid(),
  instruction: z.string().optional(),
  multiple: z.boolean(),
  content: z.array(HighlightNodeSchema).min(1),
});

export const TableCellSchema: z.ZodType = z.union([
  z.object({ type: z.literal('static'), value: z.string() }),
  z.object({ type: z.literal('input'), component: InputComponentSchema }),
  z.object({ type: z.literal('select'), component: SelectComponentSchema }),
  z.object({ type: z.literal('select_between'), component: SelectBetweenComponentSchema }),
]);

export const TableComponentSchema = z.object({
  type: z.literal('table'),
  id: z.string().uuid(),
  columns: z.array(z.string()).min(1),
  rows: z.array(z.array(TableCellSchema)).min(1),
});

export const DragSourceComponentSchema = z.object({
  type: z.literal('drag_source'),
  id: z.string().uuid(),
  words: z.array(z.string().min(1)).min(1),
  allowReuse: z.boolean(),
});

export const DragAndDropComponentSchema = z.object({
  type: z.literal('drag_and_drop'),
  id: z.string().uuid(),
  source: DragSourceComponentSchema,
  targets: z.array(DragTargetComponentSchema).min(1),
});

export const InlineNodeSchema = z.union([
  TextComponentSchema,
  InputComponentSchema,
  SelectComponentSchema,
  SelectBetweenComponentSchema,
  DragTargetComponentSchema,
]);

export const InlineContentSchema = z.object({
  type: z.literal('inline'),
  id: z.string().uuid(),
  nodes: z.array(InlineNodeSchema),
});

export const ExerciseItemSchema = z.union([
  InlineContentSchema,
  ImageComponentSchema,
  AudioComponentSchema,
  VideoComponentSchema,
  AnswerComponentSchema,
  McComponentSchema,
  HighlightComponentSchema,
  TableComponentSchema,
  DragAndDropComponentSchema,
]);

export const ExerciseSchema = z.object({
  id: z.string().uuid(),
  lessonId: z.string().uuid(),
  title: z.string().min(1).max(200),
  instructions: z.string().optional(),
  xp: z.number().int().min(0).max(9999),
  items: z.array(ExerciseItemSchema).min(1),
});
