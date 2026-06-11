/**
 * Data layer for access codes.
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/shared/api-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { queryClient } from '@/lib/shared/query-client';

export interface AccessCodeRecord {
  id: string;
  code: string;
  status: 'active' | 'used' | 'revoked';
  validFrom: string | null;
  validUntil: string | null;
  usedAt: string | null;
  createdAt: string;
  courseId: string;
  courseTitle: string;
  groupId: string | null;
  groupName: string | null;
  usedByEmail: string | null;
}

export interface UserGrantRecord {
  id: string;
  assignedAt: string;
  userId: string;
  email: string;
  courseId: string;
  courseTitle: string;
}

export interface GenerateCodesPayload {
  courseId: string;
  groupId: string | null;
  count: number;
  validFrom?: string | null;
  validUntil?: string | null;
}

export async function fetchAccessCodes(filter: { search?: string; courseId?: string; status?: string }): Promise<AccessCodeRecord[]> {
  const { data } = await apiClient.get('/access/codes', { params: filter });
  return data;
}

export async function generateAccessCodes(payload: GenerateCodesPayload): Promise<{ id: string; code: string }[]> {
  const { data } = await apiClient.post('/access/codes', payload);
  return data;
}

export async function revokeAccessCode(id: string): Promise<void> {
  await apiClient.delete(`/access/codes/${id}`);
}

export async function fetchUserGrants(filter: { search?: string; courseId?: string }): Promise<UserGrantRecord[]> {
  const { data } = await apiClient.get('/access/users', { params: filter });
  return data;
}

export async function grantUserAccess(payload: { email: string; courseId: string }): Promise<{ email: string; courseId: string }> {
  const { data } = await apiClient.post('/access/users', payload);
  return data;
}

export async function revokeUserGrant(id: string): Promise<void> {
  await apiClient.delete(`/access/users/${id}`);
}

export function useAccessCodes(filter: { search?: string; courseId?: string; status?: string }) {
  return useQuery({ queryKey: QUERY_KEYS.accessCodesGlobal(filter), queryFn: () => fetchAccessCodes(filter) });
}

export function useUserGrants(filter: { search?: string; courseId?: string }) {
  return useQuery({ queryKey: QUERY_KEYS.accessUserGrants(filter), queryFn: () => fetchUserGrants(filter) });
}

export function invalidateCodes() {
  queryClient.invalidateQueries({ queryKey: ['access', 'codes'] });
}

export function invalidateGrants() {
  queryClient.invalidateQueries({ queryKey: ['access', 'users'] });
}

export function useGenerateCodes() {
  return useMutation({ mutationFn: generateAccessCodes, onSuccess: invalidateCodes });
}

export function useRevokeCode() {
  return useMutation({ mutationFn: revokeAccessCode, onSuccess: invalidateCodes });
}

export function useGrantUser() {
  return useMutation({ mutationFn: grantUserAccess, onSuccess: invalidateGrants });
}

export function useRevokeGrant() {
  return useMutation({ mutationFn: revokeUserGrant, onSuccess: invalidateGrants });
}
