/**
 * Data layer for lesson content (blocks).
 */
import apiClient from '@/lib/shared/api-client';
import { Block } from './lesson-content.types';

export async function fetchBlocks(lessonId: string): Promise<Block[]> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/blocks`);
  return data;
}

export async function fetchLessonInfo(lessonId: string): Promise<{ lessonTitle: string; courseId: string; courseTitle: string }> {
  const { data } = await apiClient.get(`/lessons/${lessonId}/info`);
  return data;
}

export async function reorderBlocks(lessonId: string, orderedIds: string[]): Promise<void> {
  await apiClient.patch(`/lessons/${lessonId}/blocks/reorder`, { orderedIds });
}

export async function updateBlockConfig(blockId: string, patch: Partial<Block>): Promise<void> {
  await apiClient.patch(`/blocks/${blockId}`, patch);
}

export async function deleteBlock(blockId: string): Promise<void> {
  await apiClient.delete(`/blocks/${blockId}`);
}

export async function createMixBlock(lessonId: string, title: string): Promise<Block> {
  const { data } = await apiClient.post(`/lessons/${lessonId}/mix-blocks`, { title });
  return data;
}
