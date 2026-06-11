/**
 * Zustand store of global lessons.
 */
import { create } from 'zustand';
import type { LessonsFilter } from './global-lessons.types';

const defaultFilter: LessonsFilter = {
  searchQuery: '',
  courseId: null,
  isTemplate: null,
  isLocked: null,
  sortField: 'updatedAt',
  sortDirection: 'desc',
  page: 1,
  pageSize: 30,
};

interface GlobalLessonsState {
  filter: LessonsFilter;
  selectedLessonId: string | null;
  isDetailOpen: boolean;

  setFilter: (patch: Partial<LessonsFilter>) => void;
  resetFilter: () => void;
  selectLesson: (id: string) => void;
  closeDetail: () => void;
}

export const useGlobalLessonsStore = create<GlobalLessonsState>((set) => ({
  filter: defaultFilter,
  selectedLessonId: null,
  isDetailOpen: false,

  setFilter: (patch) =>
    set((s) => ({ filter: { ...s.filter, ...patch, page: 'page' in patch ? patch.page! : 1 } })),

  resetFilter: () => set({ filter: defaultFilter }),

  selectLesson: (id) => set({ selectedLessonId: id, isDetailOpen: true }),

  closeDetail: () => set({ isDetailOpen: false, selectedLessonId: null }),
}));
