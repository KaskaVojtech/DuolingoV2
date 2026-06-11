/**
 * Loading and saving a content block.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/shared/api-client';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { useUIStore } from '@/lib/stores/ui.store';
import { BlockContentSchema } from './content-editor.schema';
import type { BlockContent } from './content-editor.types';

export async function fetchBlockContent(blockId: string): Promise<BlockContent> {
  const { data } = await apiClient.get(`/block-contents/${blockId}`);
  return data;
}

export async function createBlockContent(lessonId: string): Promise<BlockContent> {
  const { data } = await apiClient.post(`/lessons/${lessonId}/block-contents`);
  return data;
}

export async function saveBlockContent(content: BlockContent): Promise<void> {
  BlockContentSchema.parse(content);
  await apiClient.patch(`/block-contents/${content.id}`, content);
}

export async function uploadMedia(file: File, type: 'image' | 'audio' | 'video'): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  const { data } = await apiClient.post('/uploads/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export function useBlockContent(blockId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.blockContent(blockId),
    queryFn: () => fetchBlockContent(blockId),
  });
}

export function useSaveBlockContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveBlockContent,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.blockContent(vars.id) });
      useUIStore.getState().showToast('Obsah uložen', 'success');
    },
  });
}
