/**
 * Course creation and thumbnail image upload.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/shared/api-client';
import { useUIStore } from '@/lib/stores/ui.store';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import type { CourseCreatePayload, CourseCreateResult } from './course-create.types';

export async function uploadCourseThumbnail(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post('/uploads/course-thumbnail', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function createCourse(payload: CourseCreatePayload): Promise<CourseCreateResult> {
  const { data } = await apiClient.post('/courses', payload);
  return data;
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses() });
      useUIStore.getState().showToast('Kurz vytvořen', 'success');
    },
  });
}
