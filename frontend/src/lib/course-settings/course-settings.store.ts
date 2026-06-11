/**
 * Zustand store of course settings.
 */
import { create } from 'zustand';
import { CourseVisibility, TableFilter } from './course-settings.types';

const DEFAULT_FILTER: TableFilter = {
  searchQuery: '',
  sortField: 'created_at',
  sortDirection: 'desc',
  page: 1,
  pageSize: 20,
};

interface CourseSettingsState {
  courseId: string | null;
  courseTitle: string;
  visibility: CourseVisibility;
  thumbnailColor: string;
  thumbnailUrl: string | null;
  codeTableFilter: TableFilter;
  emailTableFilter: TableFilter;
  selectedCodeIds: string[];
  selectedEmailIds: string[];

  setCourseTitle: (title: string) => void;
  setVisibility: (v: CourseVisibility) => void;
  setThumbnailColor: (color: string) => void;
  setThumbnailUrl: (url: string | null) => void;
  setCodeTableFilter: (f: Partial<TableFilter>) => void;
  setEmailTableFilter: (f: Partial<TableFilter>) => void;
  toggleCodeSelection: (id: string) => void;
  toggleEmailSelection: (id: string) => void;
  selectAllCodes: (ids: string[]) => void;
  selectAllEmails: (ids: string[]) => void;
  clearCodeSelection: () => void;
  clearEmailSelection: () => void;
  initCourse: (id: string, title: string, visibility: CourseVisibility, thumbnailColor: string, thumbnailUrl: string | null) => void;
}

export const useCourseSettingsStore = create<CourseSettingsState>((set) => ({
  courseId: null,
  courseTitle: '',
  visibility: 'public',
  thumbnailColor: '#4f6ef7',
  thumbnailUrl: null,
  codeTableFilter: { ...DEFAULT_FILTER },
  emailTableFilter: { ...DEFAULT_FILTER },
  selectedCodeIds: [],
  selectedEmailIds: [],

  setCourseTitle: (courseTitle) => set({ courseTitle }),
  setVisibility: (visibility) => set({ visibility }),
  setThumbnailColor: (thumbnailColor) => set({ thumbnailColor }),
  setThumbnailUrl: (thumbnailUrl) => set({ thumbnailUrl }),
  setCodeTableFilter: (f) =>
    set((s) => ({ codeTableFilter: { ...s.codeTableFilter, ...f, page: f.page ?? 1 } })),
  setEmailTableFilter: (f) =>
    set((s) => ({ emailTableFilter: { ...s.emailTableFilter, ...f, page: f.page ?? 1 } })),
  toggleCodeSelection: (id) =>
    set((s) => ({
      selectedCodeIds: s.selectedCodeIds.includes(id)
        ? s.selectedCodeIds.filter((x) => x !== id)
        : [...s.selectedCodeIds, id],
    })),
  toggleEmailSelection: (id) =>
    set((s) => ({
      selectedEmailIds: s.selectedEmailIds.includes(id)
        ? s.selectedEmailIds.filter((x) => x !== id)
        : [...s.selectedEmailIds, id],
    })),
  selectAllCodes: (ids) => set({ selectedCodeIds: ids }),
  selectAllEmails: (ids) => set({ selectedEmailIds: ids }),
  clearCodeSelection: () => set({ selectedCodeIds: [] }),
  clearEmailSelection: () => set({ selectedEmailIds: [] }),
  initCourse: (courseId, courseTitle, visibility, thumbnailColor, thumbnailUrl) =>
    set({ courseId, courseTitle, visibility, thumbnailColor, thumbnailUrl }),
}));
