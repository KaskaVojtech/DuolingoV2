/**
 * Data layer for importing lesson templates.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/shared/api-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { useUIStore } from '@/lib/stores/ui.store';
import type { LessonTemplate, CourseLesson, TemplateBlock } from './template-import.types';

export async function fetchTemplates(): Promise<LessonTemplate[]> {
  const { data } = await apiClient.get('/lessons/templates');
  return data;
}

export async function fetchTemplateBlocks(templateId: string): Promise<TemplateBlock[]> {
  const { data } = await apiClient.get(`/lessons/${templateId}/blocks`);
  return data;
}

export async function fetchCourseLessons(courseId: string): Promise<CourseLesson[]> {
  const { data } = await apiClient.get(`/courses/${courseId}/lessons`);
  return data;
}

export async function importTemplates(payload: {
  courseId: string;
  templateIds: string[];
  afterOrder: number;
}): Promise<void> {
  await apiClient.post(`/courses/${payload.courseId}/lessons/import-templates`, {
    templateIds: payload.templateIds,
    afterOrder: payload.afterOrder,
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: QUERY_KEYS.templates(),
    queryFn: fetchTemplates,
  });
}

export function useCourseLessons(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.lessons(courseId),
    queryFn: () => fetchCourseLessons(courseId),
    enabled: !!courseId,
  });
}

export function useImportTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: importTemplates,
    onSuccess: (_, { courseId, templateIds }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.lessons(courseId) });
      const count = templateIds.length;
      const label = count === 1 ? 'lekce importována' : count < 5 ? 'lekce importovány' : 'lekcí importováno';
      useUIStore.getState().showToast(`${count} ${label}`, 'success');
    },
  });
}
