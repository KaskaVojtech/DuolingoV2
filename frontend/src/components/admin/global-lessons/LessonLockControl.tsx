'use client';

import { LessonListItem } from '@/lib/global-lessons/global-lessons.types';
import { useUpdateLessonLock } from '@/lib/global-lessons/global-lessons.api';
import { useGlobalLessonsStore } from '@/lib/global-lessons/global-lessons.store';

interface Props { lesson: LessonListItem }

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function LessonLockControl({ lesson }: Props) {
  const { mutate } = useUpdateLessonLock();
  const { selectLesson } = useGlobalLessonsStore();

  if (lesson.lockMode === 'toggle') {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); mutate({ lessonId: lesson.id, config: { isLocked: !lesson.isLocked } }); }}
        className={`relative w-9 h-5 rounded-full transition-colors ${lesson.isLocked ? 'bg-admin-text-muted' : 'bg-admin-primary'}`}
        aria-label={lesson.isLocked ? 'Odemknout' : 'Zamknout'}
      >
        <span
          className={`absolute w-4 h-4 rounded-full bg-white transition-transform`}
          style={{ top: 2, left: 2, transform: lesson.isLocked ? 'translateX(0)' : 'translateX(16px)' }}
        />
      </button>
    );
  }

  if (lesson.lockMode === 'scheduled') {
    const text = lesson.accessFrom && lesson.accessUntil
      ? `${formatDate(lesson.accessFrom)}–${formatDate(lesson.accessUntil)}`
      : lesson.accessFrom ? `Od ${formatDate(lesson.accessFrom)}`
      : lesson.accessUntil ? `Do ${formatDate(lesson.accessUntil)}`
      : 'Plánováno';
    return (
      <button
        onClick={(e) => { e.stopPropagation(); selectLesson(lesson.id); }}
        className="flex items-center gap-1 text-admin-xs text-admin-text-muted hover:text-admin-text"
      >
        <i className="ti ti-calendar text-[12px]" aria-hidden="true" />
        {text}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => { e.stopPropagation(); selectLesson(lesson.id); }}
      className="flex items-center gap-1 text-admin-xs text-admin-text-muted hover:text-admin-text"
    >
      <i className="ti ti-lock text-[12px]" aria-hidden="true" />
      Podmínka
    </button>
  );
}
