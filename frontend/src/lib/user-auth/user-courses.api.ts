/**
 * Loads the user's courses and lessons and (un)completes lessons.
 */
import userApiClient from './user-api-client';

export interface UserCourse {
  courseId: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  thumbnailColor: string;
  validFrom: string | null;
  validUntil: string | null;
}

export async function fetchMyCourses(): Promise<UserCourse[]> {
  const { data } = await userApiClient.get('/user/courses');
  return data;
}

export async function joinCourse(code: string): Promise<void> {
  await userApiClient.post('/user/courses/join', { code });
}

export type LockMode = 'toggle' | 'scheduled' | 'constraint';
export type CompletionMode = 'manual_button' | 'blocks_completion';

export interface UserLesson {
  id: string;
  title: string;
  order: number;
  isLocked: boolean;
  lockMode: LockMode;
  unlockAt: string | null;
  lockAt: string | null;
  completionMode: CompletionMode;
  blockScope: 'exercise' | 'content' | 'both';
  isCompleted: boolean;
  mandatoryBlocksTotal: number;
  mandatoryBlocksDone: number;
  blocksAllDone: boolean;
}

export async function fetchCourseLessons(courseId: string): Promise<UserLesson[]> {
  const { data } = await userApiClient.get(`/user/courses/${courseId}/lessons`);
  return data;
}

export async function completeLesson(lessonId: string): Promise<void> {
  await userApiClient.post(`/user/lessons/${lessonId}/complete`);
}

export async function uncompleteLesson(lessonId: string): Promise<void> {
  await userApiClient.delete(`/user/lessons/${lessonId}/complete`);
}
