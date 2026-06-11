/**
 * Data layer of deleted courses (trash) and their restoration.
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/shared/query-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import apiClient from '@/lib/shared/api-client';

export type DeletedCoursesSort = 'deleted_desc' | 'deleted_asc' | 'title_asc' | 'title_desc';

export interface DeletedCourse {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  thumbnailColor: string;
  isTemplate: boolean;
  lessonsCount: number;
  deletedAt: string;
  scheduledDeleteAt: string | null;
}

export interface DeletedCoursesFilter {
  search: string;
  sort: DeletedCoursesSort;
}

export async function fetchDeletedCourses(filter: DeletedCoursesFilter): Promise<DeletedCourse[]> {
  const { data } = await apiClient.get('/courses/deleted', {
    params: { search: filter.search || undefined, sort: filter.sort },
  });
  return data;
}

export async function restoreCourseApi(courseId: string): Promise<{ id: string; title: string }> {
  const { data } = await apiClient.post(`/courses/${courseId}/restore`);
  return data;
}

export async function purgeCourseApi(courseId: string): Promise<{ id: string }> {
  const { data } = await apiClient.delete(`/courses/${courseId}/permanent`);
  return data;
}

export function useDeletedCourses(filter: DeletedCoursesFilter) {
  return useQuery({
    queryKey: QUERY_KEYS.deletedCourses(filter),
    queryFn: () => fetchDeletedCourses(filter),
  });
}

function invalidateCourses() {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses() });
}

export function useRestoreCourse() {
  return useMutation({
    mutationFn: restoreCourseApi,
    onSuccess: invalidateCourses,
  });
}

export function usePurgeCourse() {
  return useMutation({
    mutationFn: purgeCourseApi,
    onSuccess: invalidateCourses,
  });
}
