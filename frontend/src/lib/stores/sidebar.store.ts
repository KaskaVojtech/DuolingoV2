/**
 * Zustand store of the sidebar state (collapse).
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isExpanded: boolean;
  toggle: () => void;
  setExpanded: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isExpanded: true,
      toggle: () => set((s) => ({ isExpanded: !s.isExpanded })),
      setExpanded: (v) => set({ isExpanded: v }),
    }),
    { name: 'admin-sidebar-expanded' }
  )
);
