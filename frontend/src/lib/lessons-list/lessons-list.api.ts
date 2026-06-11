/**
 * Data layer for a course's lesson list.
 */
import apiClient from '@/lib/shared/api-client';
import { Lesson } from './lessons-list.types';

export async function fetchLessons(courseId: string): Promise<Lesson[]> {
  const { data } = await apiClient.get(`/courses/${courseId}/lessons`);
  return data;
}

export async function fetchCourseTitleForLessons(courseId: string): Promise<string> {
  const { data } = await apiClient.get(`/courses/${courseId}`);
  return data.title ?? 'Kurz';
}

export async function reorderLessons(courseId: string, orderedIds: string[]): Promise<void> {
  await apiClient.patch(`/courses/${courseId}/lessons/reorder`, { orderedIds });
}

export async function updateLessonConfig(lessonId: string, patch: Partial<Lesson>): Promise<void> {
  await apiClient.patch(`/lessons/${lessonId}`, patch);
}

export async function deleteLesson(lessonId: string): Promise<void> {
  await apiClient.delete(`/lessons/${lessonId}`);
}

export async function saveLessonAsTemplate(payload: { lessonId: string; templateName: string }): Promise<void> {
  await apiClient.post(`/lessons/${payload.lessonId}/save-as-template`, { templateName: payload.templateName });
}
