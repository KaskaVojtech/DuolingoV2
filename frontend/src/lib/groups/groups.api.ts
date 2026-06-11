/**
 * Data layer for user groups.
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/shared/api-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { queryClient } from '@/lib/shared/query-client';
import { useUIStore } from '@/lib/stores/ui.store';
import { Group, GroupDetail, GroupUser, GroupCourseAssignment } from './groups.types';

export async function fetchGroups(): Promise<Group[]> {
  const { data } = await apiClient.get('/groups');
  return data;
}

export async function fetchGroup(id: string): Promise<GroupDetail> {
  const { data } = await apiClient.get(`/groups/${id}`);
  return data;
}

export async function searchUsers(q: string): Promise<GroupUser[]> {
  const { data } = await apiClient.get('/groups/users/search', { params: { q } });
  return data;
}

export function useGroups() {
  return useQuery({ queryKey: QUERY_KEYS.groups(), queryFn: fetchGroups });
}

export function useGroup(id: string) {
  return useQuery({ queryKey: QUERY_KEYS.group(id), queryFn: () => fetchGroup(id), enabled: !!id });
}

export function useUserSearch(q: string) {
  return useQuery({
    queryKey: QUERY_KEYS.groupsUserSearch(q),
    queryFn: () => searchUsers(q),
    enabled: q.length >= 1,
    staleTime: 10_000,
  });
}

export function useCreateGroup() {
  return useMutation({
    mutationFn: (data: { name: string; color: string }) => apiClient.post('/groups', data).then((r) => r.data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups() }); },
    onError: () => useUIStore.getState().showToast('Chyba při vytváření skupiny', 'error'),
  });
}

export function useUpdateGroup(id: string) {
  return useMutation({
    mutationFn: (patch: { name?: string; color?: string }) => apiClient.patch(`/groups/${id}`, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.group(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups() });
    },
    onError: () => useUIStore.getState().showToast('Chyba při ukládání', 'error'),
  });
}

export function useDeleteGroup() {
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/groups/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups() });
      useUIStore.getState().showToast('Skupina smazána');
    },
    onError: () => useUIStore.getState().showToast('Chyba při mazání skupiny', 'error'),
  });
}

export function useAddMember(groupId: string) {
  return useMutation({
    mutationFn: (userId: string) => apiClient.post(`/groups/${groupId}/members`, { userId }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: QUERY_KEYS.group(groupId) }); },
    onError: () => useUIStore.getState().showToast('Chyba při přidávání člena', 'error'),
  });
}

export function useRemoveMember(groupId: string) {
  return useMutation({
    mutationFn: (userId: string) => apiClient.delete(`/groups/${groupId}/members/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.group(groupId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups() });
    },
    onError: () => useUIStore.getState().showToast('Chyba při odebírání člena', 'error'),
  });
}

export function useGroupCourses(groupId: string) {
  return useQuery<GroupCourseAssignment[]>({
    queryKey: QUERY_KEYS.groupCourses(groupId),
    queryFn: async () => (await apiClient.get(`/groups/${groupId}/courses`)).data,
    enabled: !!groupId,
  });
}

export function useAssignCourseToGroup(groupId: string) {
  return useMutation({
    mutationFn: (courseId: string) => apiClient.post(`/groups/${groupId}/courses`, { courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groupCourses(groupId) });
      useUIStore.getState().showToast('Kurz přiřazen skupině', 'success');
    },
    onError: () => useUIStore.getState().showToast('Chyba při přiřazení kurzu', 'error'),
  });
}

export function useUnassignCourseFromGroup(groupId: string) {
  return useMutation({
    mutationFn: (courseId: string) => apiClient.delete(`/groups/${groupId}/courses/${courseId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groupCourses(groupId) });
      useUIStore.getState().showToast('Kurz odebrán skupině', 'success');
    },
    onError: () => useUIStore.getState().showToast('Chyba při odebrání kurzu', 'error'),
  });
}
