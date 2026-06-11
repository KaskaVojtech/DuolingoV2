/**
 * Data layer for user management.
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/shared/api-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { queryClient } from '@/lib/shared/query-client';
import { useUIStore } from '@/lib/stores/ui.store';
import type { UserDetail, UserCourseAccess } from './users.types';

export function useUserDetail(id: string) {
  return useQuery<UserDetail>({
    queryKey: QUERY_KEYS.userDetail(id),
    queryFn: async () => (await apiClient.get(`/users/${id}`)).data,
    enabled: !!id,
  });
}

export function useUserCourses(userId: string) {
  return useQuery<UserCourseAccess[]>({
    queryKey: QUERY_KEYS.userCourses(userId),
    queryFn: async () => (await apiClient.get(`/users/${userId}/courses`)).data,
    enabled: !!userId,
  });
}

export function useAssignCourseToUser(userId: string) {
  return useMutation({
    mutationFn: (courseId: string) => apiClient.post(`/users/${userId}/courses`, { courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userCourses(userId) });
      useUIStore.getState().showToast('Kurz přiřazen', 'success');
    },
    onError: () => useUIStore.getState().showToast('Chyba při přiřazení kurzu', 'error'),
  });
}

export function useRevokeUserCourseAccess(userId: string) {
  return useMutation({
    mutationFn: (accessId: string) => apiClient.delete(`/users/${userId}/courses/${accessId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userCourses(userId) });
      useUIStore.getState().showToast('Přístup odebrán', 'success');
    },
    onError: () => useUIStore.getState().showToast('Chyba při odebrání přístupu', 'error'),
  });
}
