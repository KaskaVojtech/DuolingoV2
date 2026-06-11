/**
 * Zustand store of the course overview state (filters, selection, view).
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewMode } from './courses.types';

interface CoursesState {
  viewMode: ViewMode;
  searchQuery: string;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (q: string) => void;
}

export const useCoursesStore = create<CoursesState>()(
  persist(
    (set) => ({
      viewMode: 'grid-large',
      searchQuery: '',
      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    {
      name: 'admin-courses-view-mode',
      partialize: (s) => ({ viewMode: s.viewMode }),
    }
  )
);
