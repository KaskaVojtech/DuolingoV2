/**
 * Zustand store of the lesson content editor (blocks, locks).
 */
import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { Block } from './lesson-content.types';
import { reorderBlocks as apiReorder } from './lesson-content.api';

let reorderTimer: ReturnType<typeof setTimeout> | null = null;

interface LessonContentState {
  blocks: Block[];
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  isDrawerOpen: boolean;
  drawerBlockId: string | null;

  setBlocks: (blocks: Block[], lessonId: string, lessonTitle: string, courseId: string, courseTitle: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  moveBlockUp: (blockId: string) => void;
  moveBlockDown: (blockId: string) => void;
  openDrawer: (blockId: string) => void;
  closeDrawer: () => void;
  updateBlock: (blockId: string, patch: Partial<Block>) => void;
  removeBlock: (blockId: string) => void;
}

export const useLessonContentStore = create<LessonContentState>((set, get) => ({
  blocks: [],
  lessonId: '',
  lessonTitle: '',
  courseId: '',
  courseTitle: '',
  isDrawerOpen: false,
  drawerBlockId: null,

  setBlocks: (blocks, lessonId, lessonTitle, courseId, courseTitle) =>
    set({ blocks, lessonId, lessonTitle, courseId, courseTitle }),

  reorderBlocks: (activeId, overId) => {
    const { blocks } = get();
    const oldIndex = blocks.findIndex((b) => b.id === activeId);
    const newIndex = blocks.findIndex((b) => b.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({ ...b, order: i + 1 }));
    set({ blocks: reordered });
    if (reorderTimer) clearTimeout(reorderTimer);
    reorderTimer = setTimeout(() => {
      const lessonId = reordered[0]?.lessonId;
      if (lessonId) apiReorder(lessonId, reordered.map((b) => b.id));
    }, 500);
  },

  moveBlockUp: (blockId) => {
    const { blocks, reorderBlocks } = get();
    const idx = blocks.findIndex((b) => b.id === blockId);
    if (idx <= 0) return;
    reorderBlocks(blockId, blocks[idx - 1].id);
  },

  moveBlockDown: (blockId) => {
    const { blocks, reorderBlocks } = get();
    const idx = blocks.findIndex((b) => b.id === blockId);
    if (idx === -1 || idx >= blocks.length - 1) return;
    reorderBlocks(blockId, blocks[idx + 1].id);
  },

  openDrawer: (blockId) => set({ isDrawerOpen: true, drawerBlockId: blockId }),
  closeDrawer: () => set({ isDrawerOpen: false, drawerBlockId: null }),

  updateBlock: (blockId, patch) =>
    set((s) => ({ blocks: s.blocks.map((b) => b.id === blockId ? { ...b, ...patch } : b) })),

  removeBlock: (blockId) =>
    set((s) => ({
      blocks: s.blocks.filter((b) => b.id !== blockId).map((b, i) => ({ ...b, order: i + 1 })),
    })),
}));
