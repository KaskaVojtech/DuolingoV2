'use client';

import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';
import { useUIStore } from '@/lib/stores/ui.store';
import { Lesson } from '@/lib/lessons-list/lessons-list.types';

interface LessonRowActionsProps {
  lesson: Lesson;
}

export function LessonRowActions({ lesson }: LessonRowActionsProps) {
  const { openDrawer } = useLessonsListStore();
  const openModal = useUIStore((s) => s.openModal);

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={(e) => {
          e.stopPropagation();
          openModal('saveTemplate', {
            courseId: lesson.courseId,
            courseTitle: lesson.title,
            defaultName: `${lesson.title} — šablona`,
            targetId: lesson.id,
            targetType: 'lesson',
          });
        }}
        title="Uložit jako šablonu"
        className="w-7 h-7 flex items-center justify-center text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2 rounded-admin-sm transition-colors"
      >
        <i className="ti ti-template text-[14px]" aria-hidden="true" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          openModal('deleteLesson', { lessonId: lesson.id, lessonTitle: lesson.title });
        }}
        title="Smazat lekci"
        className="w-7 h-7 flex items-center justify-center text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger-bg rounded-admin-sm transition-colors"
      >
        <i className="ti ti-trash text-[14px]" aria-hidden="true" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); openDrawer(lesson.id); }}
        title="Nastavení lekce"
        className="w-7 h-7 flex items-center justify-center text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2 rounded-admin-sm transition-colors"
      >
        <i className="ti ti-dots text-[14px]" aria-hidden="true" />
      </button>
    </div>
  );
}
