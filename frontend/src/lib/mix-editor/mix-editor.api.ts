/**
 * Mix editor data layer: loading/saving games, vocabulary and generating sentences via the LLM.
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import apiClient from '@/lib/shared/api-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { queryClient } from '@/lib/shared/query-client';
import { useUIStore } from '@/lib/stores/ui.store';
import { VocabularyWord } from '@/lib/vocabulary/vocabulary.types';
import { LlmSentence } from '@/components/admin/mix-editor/games/shared/generate-result';
import { LessonMix } from './mix-editor.types';

export async function fetchLessonMix(lessonId: string): Promise<LessonMix> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/mix`);
  return data;
}

export async function fetchGenerationWords(lessonId: string): Promise<VocabularyWord[]> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/mix/words`);
  return data;
}

export async function requestSentences(
  lessonId: string,
  kind: 'fill_in' | 'word_order',
  count: number,
): Promise<LlmSentence[]> {
  try {
    const { data } = await apiClient.post(`/lessons/${lessonId}/mix/sentences`, { kind, count });
    return data.sentences ?? [];
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    const message = axiosErr.response?.data?.message ?? 'AI generování selhalo.';
    throw new Error(message);
  }
}

export async function saveLessonMix(lessonId: string, mix: LessonMix): Promise<LessonMix> {
  const { data } = await apiClient.patch(`/lessons/${lessonId}/mix`, mix);
  return data;
}

export function useLessonMix(lessonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.lessonMix(lessonId),
    queryFn: () => fetchLessonMix(lessonId),
    enabled: !!lessonId,
  });
}

export function useSaveLessonMix(lessonId: string) {
  return useMutation({
    mutationFn: (mix: LessonMix) => saveLessonMix(lessonId, mix),
    onSuccess: (saved) => {
      queryClient.setQueryData(QUERY_KEYS.lessonMix(lessonId), saved);
      useUIStore.getState().showToast('Mix byl uložen');
    },
    onError: () => {
      useUIStore.getState().showToast('Chyba při ukládání mixu', 'error');
    },
  });
}
