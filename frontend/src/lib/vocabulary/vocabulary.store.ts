/**
 * Zustand store of the vocabulary editor.
 */
import { create } from 'zustand';
import type { VocabularyFilter } from './vocabulary.types';

const defaultFilter: VocabularyFilter = {
  searchQuery: '',
  pos: null,
  importedOnly: false,
  sortField: 'addedAt',
  sortDirection: 'desc',
};

interface VocabularyState {
  filter: VocabularyFilter;
  setFilter: (patch: Partial<VocabularyFilter>) => void;
  resetFilter: () => void;
}

export const useVocabularyStore = create<VocabularyState>((set) => ({
  filter: defaultFilter,
  setFilter: (patch) => set((s) => ({ filter: { ...s.filter, ...patch } })),
  resetFilter: () => set({ filter: defaultFilter }),
}));
