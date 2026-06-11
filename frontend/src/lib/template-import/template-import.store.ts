/**
 * Zustand store of template import.
 */
import { create } from 'zustand';
import type { ImportPhase, DropZone } from './template-import.types';
import { importTemplates } from './template-import.api';
import { useUIStore } from '@/lib/stores/ui.store';

interface TemplateImportState {
  courseId: string | null;
  selectedTemplateIds: string[];
  searchQuery: string;
  previewTemplateId: string | null;
  phase: ImportPhase;
  activeDropZone: DropZone | null;
  isImporting: boolean;

  setCourseId: (id: string) => void;
  toggleTemplate: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setPreviewTemplate: (id: string | null) => void;
  startPlacing: () => void;
  setActiveDropZone: (zone: DropZone | null) => void;
  confirmImport: (afterOrder: number) => Promise<void>;
  cancelPlacing: () => void;
}

export const useTemplateImportStore = create<TemplateImportState>((set, get) => ({
  courseId: null,
  selectedTemplateIds: [],
  searchQuery: '',
  previewTemplateId: null,
  phase: 'selecting',
  activeDropZone: null,
  isImporting: false,

  setCourseId: (id) => set({ courseId: id }),

  toggleTemplate: (id) =>
    set((s) => ({
      selectedTemplateIds: s.selectedTemplateIds.includes(id)
        ? s.selectedTemplateIds.filter((tid) => tid !== id)
        : [...s.selectedTemplateIds, id],
    })),

  setSearchQuery: (q) => set({ searchQuery: q }),

  setPreviewTemplate: (id) => set({ previewTemplateId: id }),

  startPlacing: () => set({ phase: 'placing', activeDropZone: null }),

  setActiveDropZone: (zone) => set({ activeDropZone: zone }),

  confirmImport: async (afterOrder) => {
    const { courseId, selectedTemplateIds } = get();
    if (!courseId || selectedTemplateIds.length === 0) return;
    set({ isImporting: true });
    try {
      await importTemplates({ courseId, templateIds: selectedTemplateIds, afterOrder });
      set({ selectedTemplateIds: [], phase: 'selecting', activeDropZone: null });
    } finally {
      set({ isImporting: false });
    }
  },

  cancelPlacing: () => set({ phase: 'selecting', activeDropZone: null }),
}));
