/**
 * Data layer of the lesson player: lesson content, submitting results, vocabulary, practice and progress.
 */
import userApiClient from './user-api-client';

export type UserBlockType = 'content' | 'exercise' | 'mix';

export interface UserBlockResult {
  score: number;
  total: number;
  xpEarned: number;
}

export interface UserLessonBlock {
  id: string;
  title: string;
  type: UserBlockType;
  order: number;
  isLocked: boolean;
  lockReason: 'locked' | 'scheduled_future' | 'scheduled_past' | 'constraint' | null;
  unlockAt: string | null;
  lockAt: string | null;
  requiresReadConfirmation: boolean;
  isMandatory: boolean;
  isCompleted: boolean;
  result: UserBlockResult | null;

  content?: { blocks: unknown[] };
  exercise?: { instructions: string | null; xp: number; items: unknown[] };
  mix?: { games: unknown[]; isRandomOrder: boolean; xp: number };
}

export interface UserLessonContent {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  courseColor: string;
  completion: { mode: 'manual_button' | 'blocks_completion'; blockScope?: string };
  blocks: UserLessonBlock[];
}

export async function fetchLessonContent(lessonId: string): Promise<UserLessonContent> {
  const { data } = await userApiClient.get(`/user/lessons/${lessonId}/content`);
  return data;
}

export async function completeBlock(blockId: string): Promise<void> {
  await userApiClient.post(`/user/blocks/${blockId}/complete`);
}

export async function uncompleteBlock(blockId: string): Promise<void> {
  await userApiClient.delete(`/user/blocks/${blockId}/complete`);
}

export interface SubmitActivityPayload {
  kind: 'exercise' | 'mix';
  score: number;
  total: number;
  xp: number;
}

export async function submitActivity(blockId: string, payload: SubmitActivityPayload): Promise<void> {
  await userApiClient.post(`/user/blocks/${blockId}/submit`, payload);
}

export interface UserVocabWord {
  id: string;
  wordEn: string;
  wordCs: string;
  pos: string;
  exampleSentence: string | null;
  imageUrl: string | null;
  pronunciationUrl: string | null;
  note: string | null;
  lessonTitle?: string;
  lessonOrder?: number;
}

export async function fetchCourseVocabulary(courseId: string): Promise<UserVocabWord[]> {
  const { data } = await userApiClient.get(`/user/courses/${courseId}/vocabulary`);
  return data;
}

export async function fetchLessonVocabulary(lessonId: string): Promise<UserVocabWord[]> {
  const { data } = await userApiClient.get(`/user/lessons/${lessonId}/vocabulary`);
  return data;
}

export type PracticeType =
  | 'vocab_multiple_choice' | 'vocab_translation' | 'vocab_memory' | 'vocab_drag' | 'vocab_spelling'
  | 'sent_fill_in' | 'sent_word_order' | 'sent_translation'
  | 'listen_multiple_choice' | 'listen_write';

export interface LessonPractice {
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  isPracticeEnabled: boolean;
  enabledTypes: PracticeType[];
  words: UserVocabWord[];
}

export async function fetchLessonPractice(lessonId: string): Promise<LessonPractice> {
  const { data } = await userApiClient.get(`/user/lessons/${lessonId}/practice`);
  return data;
}

export interface UserProgressCourse {
  courseId: string;
  title: string;
  thumbnailColor: string;
  totalLessons: number;
  completedLessons: number;
  earnedXp: number;
}

export interface UserProgress {
  totalXp: number;
  completedLessons: number;
  completedBlocks: number;
  courses: UserProgressCourse[];
}

export async function fetchProgress(): Promise<UserProgress> {
  const { data } = await userApiClient.get('/user/progress');
  return data;
}
