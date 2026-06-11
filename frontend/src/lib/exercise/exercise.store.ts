/**
 * Zustand store of the exercise editor (items, XP, preview).
 */
import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { Exercise, ExerciseItem } from './exercise.types';
import { saveExercise as apiSave } from './exercise.api';
import { createEmptyExercise } from './exercise.utils';

interface ExerciseEditorState {
  exercise: Exercise;
  isDirty: boolean;
  isSaving: boolean;
  activeItemId: string | null;
  previewMode: boolean;

  setExercise: (exercise: Exercise) => void;
  setTitle: (title: string) => void;
  setInstructions: (instructions: string) => void;
  setXp: (xp: number) => void;

  reorderItems: (activeId: string, overId: string) => void;
  moveItemUp: (itemId: string) => void;
  moveItemDown: (itemId: string) => void;

  addItem: (item: ExerciseItem) => void;
  updateItem: (itemId: string, updated: ExerciseItem) => void;
  deleteItem: (itemId: string) => void;

  setActiveItem: (itemId: string | null) => void;
  togglePreview: () => void;
  saveExercise: () => Promise<void>;
}

export const useExerciseStore = create<ExerciseEditorState>((set, get) => ({
  exercise: createEmptyExercise(''),
  isDirty: false,
  isSaving: false,
  activeItemId: null,
  previewMode: false,

  setExercise: (exercise) => set({ exercise, isDirty: false }),

  setTitle: (title) =>
    set((s) => ({ exercise: { ...s.exercise, title }, isDirty: true })),

  setInstructions: (instructions) =>
    set((s) => ({ exercise: { ...s.exercise, instructions }, isDirty: true })),

  setXp: (xp) =>
    set((s) => ({ exercise: { ...s.exercise, xp }, isDirty: true })),

  reorderItems: (activeId, overId) => {
    const { exercise } = get();
    const items = exercise.items;
    const oldIndex = items.findIndex((i) => i.id === activeId);
    const newIndex = items.findIndex((i) => i.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;
    set({ exercise: { ...exercise, items: arrayMove(items, oldIndex, newIndex) }, isDirty: true });
  },

  moveItemUp: (itemId) => {
    const { exercise, reorderItems } = get();
    const idx = exercise.items.findIndex((i) => i.id === itemId);
    if (idx <= 0) return;
    reorderItems(itemId, exercise.items[idx - 1].id);
  },

  moveItemDown: (itemId) => {
    const { exercise, reorderItems } = get();
    const idx = exercise.items.findIndex((i) => i.id === itemId);
    if (idx === -1 || idx >= exercise.items.length - 1) return;
    reorderItems(itemId, exercise.items[idx + 1].id);
  },

  addItem: (item) =>
    set((s) => ({
      exercise: { ...s.exercise, items: [...s.exercise.items, item] },
      isDirty: true,
      activeItemId: item.id,
    })),

  updateItem: (itemId, updated) =>
    set((s) => ({
      exercise: {
        ...s.exercise,
        items: s.exercise.items.map((i) => i.id === itemId ? updated : i),
      },
      isDirty: true,
    })),

  deleteItem: (itemId) =>
    set((s) => ({
      exercise: { ...s.exercise, items: s.exercise.items.filter((i) => i.id !== itemId) },
      isDirty: true,
      activeItemId: s.activeItemId === itemId ? null : s.activeItemId,
    })),

  setActiveItem: (itemId) => set({ activeItemId: itemId }),

  togglePreview: () => set((s) => ({ previewMode: !s.previewMode })),

  saveExercise: async () => {
    set({ isSaving: true });
    try {
      await apiSave(get().exercise);
      set({ isDirty: false });
    } finally {
      set({ isSaving: false });
    }
  },
}));
