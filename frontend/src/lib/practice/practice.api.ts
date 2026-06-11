/**
 * Data layer for practice configuration in the admin.
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/shared/api-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { queryClient } from '@/lib/shared/query-client';
import { useUIStore } from '@/lib/stores/ui.store';
import { LessonPracticeConfig, PracticeType } from './practice.types';

export async function fetchPracticeConfig(lessonId: string): Promise<LessonPracticeConfig> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/practice/config`);
  return data;
}

export async function togglePracticeEnabled(lessonId: string, enabled: boolean): Promise<void> {
  await apiClient.patch(`/lessons/${lessonId}/practice/config`, { isPracticeEnabled: enabled });
}

export async function togglePracticeType(lessonId: string, type: PracticeType, enabled: boolean): Promise<void> {
  await apiClient.patch(`/lessons/${lessonId}/practice/types/${type}`, { isEnabled: enabled });
}

export async function regeneratePractice(lessonId: string): Promise<void> {
  await apiClient.post(`/lessons/${lessonId}/practice/regenerate`);
}

export function usePracticeConfig(lessonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.practiceConfig(lessonId),
    queryFn: () => fetchPracticeConfig(lessonId),
    enabled: !!lessonId,
  });
}

export function useTogglePracticeEnabled(lessonId: string) {
  return useMutation({
    mutationFn: (enabled: boolean) => togglePracticeEnabled(lessonId, enabled),
    onMutate: async (enabled) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.practiceConfig(lessonId) });
      const prev = queryClient.getQueryData<LessonPracticeConfig>(QUERY_KEYS.practiceConfig(lessonId));
      queryClient.setQueryData(QUERY_KEYS.practiceConfig(lessonId), (old: LessonPracticeConfig | undefined) =>
        old ? { ...old, isPracticeEnabled: enabled } : old
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(QUERY_KEYS.practiceConfig(lessonId), ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.practiceConfig(lessonId) });
    },
  });
}

export function useTogglePracticeType(lessonId: string) {
  return useMutation({
    mutationFn: ({ type, enabled }: { type: PracticeType; enabled: boolean }) =>
      togglePracticeType(lessonId, type, enabled),
    onMutate: async ({ type, enabled }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.practiceConfig(lessonId) });
      const prev = queryClient.getQueryData<LessonPracticeConfig>(QUERY_KEYS.practiceConfig(lessonId));
      queryClient.setQueryData(QUERY_KEYS.practiceConfig(lessonId), (old: LessonPracticeConfig | undefined) =>
        old
          ? { ...old, types: old.types.map((t) => (t.type === type ? { ...t, isEnabled: enabled } : t)) }
          : old
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(QUERY_KEYS.practiceConfig(lessonId), ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.practiceConfig(lessonId) });
    },
  });
}

export function useRegeneratePractice(lessonId: string) {
  return useMutation({
    mutationFn: () => regeneratePractice(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.practiceConfig(lessonId) });
      useUIStore.getState().showToast('Cvičení regenerována');
    },
    onError: () => {
      useUIStore.getState().showToast('Chyba při regeneraci', 'error');
    },
  });
}
