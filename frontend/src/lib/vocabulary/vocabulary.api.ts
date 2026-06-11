/**
 * Data layer for lesson vocabulary.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/shared/api-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { useUIStore } from '@/lib/stores/ui.store';
import type {
  VocabularyWord, LessonVocabularyEntry, VocabularyFilter, LessonForImport,
} from './vocabulary.types';

export async function fetchLessonVocabulary(lessonId: string, filter: VocabularyFilter): Promise<LessonVocabularyEntry[]> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/vocabulary`, { params: filter });
  return data;
}

export async function fetchLessonVocabularyForImport(lessonId: string): Promise<VocabularyWord[]> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/vocabulary/words`);
  return data;
}

export async function fetchLessonsForImport(excludeLessonId: string): Promise<LessonForImport[]> {
  const { data } = await apiClient.get('/lessons/for-import', { params: { excludeLessonId } });
  return data;
}

export async function checkVocabularyDuplicate(wordEn: string, wordCs: string): Promise<{ exists: boolean; wordId?: string }> {
  const { data } = await apiClient.get('/vocabulary/check-duplicate', { params: { wordEn, wordCs } });
  return data;
}

export async function createVocabularyWord(data: Omit<VocabularyWord, 'id' | 'createdAt' | 'updatedAt'>): Promise<VocabularyWord> {
  const { data: result } = await apiClient.post('/vocabulary', data);
  return result;
}

export async function addWordToLesson(lessonId: string, vocabularyId: string): Promise<LessonVocabularyEntry> {
  const { data } = await apiClient.post(`/lessons/${lessonId}/vocabulary`, { vocabularyId });
  return data;
}

export async function updateVocabularyWord(wordId: string, patch: Partial<VocabularyWord>): Promise<VocabularyWord> {
  const { data } = await apiClient.patch(`/vocabulary/${wordId}`, patch);
  return data;
}

export async function removeWordFromLesson(lessonId: string, entryId: string): Promise<void> {
  await apiClient.delete(`/lessons/${lessonId}/vocabulary/${entryId}`);
}

export async function importWordsToLesson(payload: { lessonId: string; sourceWordIds: string[]; importedFromLessonId: string }): Promise<void> {
  await apiClient.post(`/lessons/${payload.lessonId}/vocabulary/import`, {
    sourceWordIds: payload.sourceWordIds,
    importedFromLessonId: payload.importedFromLessonId,
  });
}

export async function uploadPronunciation(file: File): Promise<{ url: string }> {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await apiClient.post('/uploads/pronunciation', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}

export async function uploadWordImage(file: File): Promise<{ url: string }> {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await apiClient.post('/uploads/word-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}

export function useLessonVocabulary(lessonId: string, filter: VocabularyFilter) {
  return useQuery({
    queryKey: QUERY_KEYS.lessonVocabulary(lessonId, filter),
    queryFn: () => fetchLessonVocabulary(lessonId, filter),
    enabled: !!lessonId,
  });
}

export function useLessonsForImport(excludeLessonId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.lessonsForImport(excludeLessonId),
    queryFn: () => fetchLessonsForImport(excludeLessonId),
  });
}

export function useLessonVocabularyForImport(lessonId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.lessonVocabularyImport(lessonId ?? ''),
    queryFn: () => fetchLessonVocabularyForImport(lessonId!),
    enabled: !!lessonId,
  });
}

export function useAddWord(lessonId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { word: Omit<VocabularyWord, 'id' | 'createdAt' | 'updatedAt'>; pronunciationFile?: File; imageFile?: File }) => {
      let wordData = data.word;
      if (data.pronunciationFile) { const r = await uploadPronunciation(data.pronunciationFile); wordData = { ...wordData, pronunciationUrl: r.url }; }
      if (data.imageFile) { const r = await uploadWordImage(data.imageFile); wordData = { ...wordData, imageUrl: r.url }; }
      const word = await createVocabularyWord(wordData);
      await addWordToLesson(lessonId, word.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessons', lessonId, 'vocabulary'] });
      useUIStore.getState().showToast('Slovíčko přidáno', 'success');
    },
  });
}

export function useUpdateWord(lessonId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ wordId, patch }: { wordId: string; patch: Partial<VocabularyWord> }) => updateVocabularyWord(wordId, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessons', lessonId, 'vocabulary'] });
      useUIStore.getState().showToast('Slovíčko upraveno', 'success');
    },
  });
}

export function useRemoveWord(lessonId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) => removeWordFromLesson(lessonId, entryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessons', lessonId, 'vocabulary'] });
      useUIStore.getState().showToast('Slovíčko odebráno', 'success');
    },
  });
}

export function useImportWords(lessonId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { sourceWordIds: string[]; importedFromLessonId: string }) =>
      importWordsToLesson({ lessonId, ...payload }),
    onSuccess: (_, { sourceWordIds }) => {
      qc.invalidateQueries({ queryKey: ['lessons', lessonId, 'vocabulary'] });
      const count = sourceWordIds.length;
      const label = count === 1 ? 'slovíčko importováno' : count < 5 ? 'slovíčka importována' : 'slovíček importováno';
      useUIStore.getState().showToast(`${count} ${label}`, 'success');
    },
  });
}
