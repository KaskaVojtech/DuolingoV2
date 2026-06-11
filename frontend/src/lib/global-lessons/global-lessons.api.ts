/**
 * Data layer for global lessons.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import apiClient from '@/lib/shared/api-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import type { PaginatedResult } from '@/lib/shared/types';
import type { LessonListItem, LessonStats, LessonsFilter, LessonLockConfig, UserCompletionRecord } from './global-lessons.types';

export async function fetchLessons(filter: LessonsFilter): Promise<PaginatedResult<LessonListItem>> {
  const { data } = await apiClient.get('/lessons', { params: filter });
  return data;
}

export async function fetchLessonStats(lessonId: string): Promise<LessonStats> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/stats`);
  return data;
}

export async function renameLesson(lessonId: string, title: string): Promise<void> {
  await apiClient.patch(`/lessons/${lessonId}`, { title });
}

export async function updateLessonLock(lessonId: string, config: Partial<LessonLockConfig>): Promise<void> {
  await apiClient.patch(`/lessons/${lessonId}/lock`, config);
}

export async function saveLessonAsTemplate(lessonId: string): Promise<void> {
  await apiClient.post(`/lessons/${lessonId}/save-as-template`);
}

export async function fetchLessonUsers(lessonId: string, minPercent: number, maxPercent: number): Promise<UserCompletionRecord[]> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/users`, { params: { minPercent, maxPercent } });
  return data;
}

export function useLessons(filter: LessonsFilter) {
  return useQuery({
    queryKey: QUERY_KEYS.allLessons(filter),
    queryFn: () => fetchLessons(filter),
    placeholderData: keepPreviousData,
  });
}

export function useLessonStats(lessonId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.lessonStats(lessonId!),
    queryFn: () => fetchLessonStats(lessonId!),
    enabled: lessonId !== null,
  });
}

export function useRenameLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, title }: { lessonId: string; title: string }) => renameLesson(lessonId, title),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons', 'all'] }),
  });
}

export function useUpdateLessonLock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, config }: { lessonId: string; config: Partial<LessonLockConfig> }) => updateLessonLock(lessonId, config),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons', 'all'] }),
  });
}
