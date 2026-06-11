/**
 * Zustand store of the course deletion flow.
 */
import { create } from 'zustand';
import { CourseDeletePreview, CourseDeleteResult } from './course-delete.types';

interface CourseDeleteState {
  preview: CourseDeletePreview | null;
  preservedLessonIds: Set<string>;
  confirmInputValue: string;
  isSubmitting: boolean;
  deleteResult: CourseDeleteResult | null;

  setPreview: (p: CourseDeletePreview) => void;
  togglePreserveLesson: (id: string) => void;
  preserveAll: (ids: string[]) => void;
  setConfirmInput: (v: string) => void;
  setSubmitting: (v: boolean) => void;
  setDeleteResult: (r: CourseDeleteResult) => void;
  reset: () => void;
}

const initialState = {
  preview: null,
  preservedLessonIds: new Set<string>(),
  confirmInputValue: '',
  isSubmitting: false,
  deleteResult: null,
};

export const useCourseDeleteStore = create<CourseDeleteState>((set) => ({
  ...initialState,

  setPreview: (preview) => set({ preview }),
  togglePreserveLesson: (id) =>
    set((s) => {
      const next = new Set(s.preservedLessonIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { preservedLessonIds: next };
    }),
  preserveAll: (ids) => set({ preservedLessonIds: new Set(ids) }),
  setConfirmInput: (confirmInputValue) => set({ confirmInputValue }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setDeleteResult: (deleteResult) => set({ deleteResult }),
  reset: () => set({ ...initialState, preservedLessonIds: new Set<string>() }),
}));

export const isConfirmValid = (input: string, title: string) => input === `delete ${title}`;
