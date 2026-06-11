'use client';

import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';

interface LessonRowOrderButtonsProps {
  lessonId: string;
  isFirst: boolean;
  isLast: boolean;
}

export function LessonRowOrderButtons({ lessonId, isFirst, isLast }: LessonRowOrderButtonsProps) {
  const { moveLessonUp, moveLessonDown } = useLessonsListStore();

  return (
    <div className="flex flex-col">
      <button
        onClick={(e) => { e.stopPropagation(); moveLessonUp(lessonId); }}
        disabled={isFirst}
        aria-label="Přesunout lekci nahoru"
        aria-disabled={isFirst}
        className="flex items-center justify-center w-5 h-5 text-admin-text-muted hover:text-admin-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <i className="ti ti-chevron-up text-[12px]" aria-hidden="true" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); moveLessonDown(lessonId); }}
        disabled={isLast}
        aria-label="Přesunout lekci dolů"
        aria-disabled={isLast}
        className="flex items-center justify-center w-5 h-5 text-admin-text-muted hover:text-admin-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <i className="ti ti-chevron-down text-[12px]" aria-hidden="true" />
      </button>
    </div>
  );
}
