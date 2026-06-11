/**
 * Zustand store of the lesson list (filters, selection, sorting).
 */
import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { Lesson } from './lessons-list.types';
import { reorderLessons as apiReorder } from './lessons-list.api';

let reorderTimer: ReturnType<typeof setTimeout> | null = null;

interface LessonsListState {
  lessons: Lesson[];
  courseTitle: string;
  isDrawerOpen: boolean;
  drawerLessonId: string | null;

  setLessons: (lessons: Lesson[], courseTitle: string) => void;
  reorderLessons: (activeId: string, overId: string) => void;
  moveLessonUp: (lessonId: string) => void;
  moveLessonDown: (lessonId: string) => void;
  openDrawer: (lessonId: string) => void;
  closeDrawer: () => void;
  updateLesson: (lessonId: string, patch: Partial<Lesson>) => void;
  removeLesson: (lessonId: string) => void;
}

export const useLessonsListStore = create<LessonsListState>((set, get) => ({
  lessons: [],
  courseTitle: '',
  isDrawerOpen: false,
  drawerLessonId: null,

  setLessons: (lessons, courseTitle) => set({ lessons, courseTitle }),

  reorderLessons: (activeId, overId) => {
    const { lessons } = get();
    const oldIndex = lessons.findIndex((l) => l.id === activeId);
    const newIndex = lessons.findIndex((l) => l.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(lessons, oldIndex, newIndex).map((l, i) => ({ ...l, order: i + 1 }));
    set({ lessons: reordered });

    if (reorderTimer) clearTimeout(reorderTimer);
    reorderTimer = setTimeout(() => {
      const courseId = reordered[0]?.courseId;
      if (courseId) apiReorder(courseId, reordered.map((l) => l.id));
    }, 500);
  },

  moveLessonUp: (lessonId) => {
    const { lessons, reorderLessons } = get();
    const idx = lessons.findIndex((l) => l.id === lessonId);
    if (idx <= 0) return;
    reorderLessons(lessonId, lessons[idx - 1].id);
  },

  moveLessonDown: (lessonId) => {
    const { lessons, reorderLessons } = get();
    const idx = lessons.findIndex((l) => l.id === lessonId);
    if (idx === -1 || idx >= lessons.length - 1) return;
    reorderLessons(lessonId, lessons[idx + 1].id);
  },

  openDrawer: (lessonId) => set({ isDrawerOpen: true, drawerLessonId: lessonId }),
  closeDrawer: () => set({ isDrawerOpen: false, drawerLessonId: null }),

  updateLesson: (lessonId, patch) =>
    set((s) => ({
      lessons: s.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)),
    })),

  removeLesson: (lessonId) =>
    set((s) => ({
      lessons: s.lessons
        .filter((l) => l.id !== lessonId)
        .map((l, i) => ({ ...l, order: i + 1 })),
    })),
}));
