import { Block } from './lesson-content.types';

export function sortBlocksByOrder(blocks: Block[]): Block[] {
  return [...blocks].sort((a, b) => a.order - b.order);
}

export function renumberBlocks(blocks: Block[]): Block[] {
  return sortBlocksByOrder(blocks).map((b, i) => ({ ...b, order: i + 1 }));
}

export function getAdjacentBlock(blocks: Block[], blockId: string, direction: 'up' | 'down'): Block | undefined {
  const sorted = sortBlocksByOrder(blocks);
  const idx = sorted.findIndex((b) => b.id === blockId);
  if (idx === -1) return undefined;
  return direction === 'up' ? sorted[idx - 1] : sorted[idx + 1];
}
