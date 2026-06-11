/**
 * Course deletion and soft-delete.
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/shared/query-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import apiClient from '@/lib/shared/api-client';
import { CourseDeletePreview, CourseDeletePayload, CourseDeleteResult } from './course-delete.types';

export async function fetchDeletePreviewApi(courseId: string): Promise<CourseDeletePreview> {
  const { data } = await apiClient.get(`/courses/${courseId}/delete-preview`);
  return data;
}

export async function deleteCourseApi(payload: CourseDeletePayload): Promise<CourseDeleteResult> {
  const { data } = await apiClient.delete(`/courses/${payload.courseId}`, {
    data: { preserveLessonIds: payload.preserveLessonIds },
  });
  return data;
}

export function useDeletePreview(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.courseDeletePreview(courseId),
    queryFn: () => fetchDeletePreviewApi(courseId),
  });
}

export function useDeleteCourse() {
  return useMutation({
    mutationFn: deleteCourseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses() });
    },
  });
}
