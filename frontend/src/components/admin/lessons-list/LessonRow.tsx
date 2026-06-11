'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SortableItem } from '@/components/admin/common/sortable/SortableItem';
import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';
import { updateLessonConfig } from '@/lib/lessons-list/lessons-list.api';
import { Lesson } from '@/lib/lessons-list/lessons-list.types';
import { LessonRowActions } from './LessonRowActions';
import { LessonRowOrderButtons } from './LessonRowOrderButtons';

interface LessonRowProps {
  lesson: Lesson;
  isFirst: boolean;
  isLast: boolean;
}

export function LessonRow({ lesson, isFirst, isLast }: LessonRowProps) {
  const router = useRouter();
  const { updateLesson, lessons } = useLessonsListStore();
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      router.push(`/admin/lessons/${lesson.id}/content`);
    } else {
      clickTimer.current = setTimeout(() => { clickTimer.current = null; }, 250);
    }
  };

  const toggleLock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLocked = !lesson.isLocked;
    const patch = {
      isLocked: newLocked,
      lockConfig: { ...lesson.lockConfig, isLocked: newLocked },
    };
    updateLesson(lesson.id, patch);
    await updateLessonConfig(lesson.id, patch);
  };

  return (
    <SortableItem id={lesson.id}>
      {({ attributes, listeners, isDragging, setNodeRef, style }) => (
        <div
          ref={setNodeRef}
          style={style}
          className={`group flex items-center gap-3 px-admin-md py-3 bg-admin-surface border-b border-admin-border cursor-pointer select-none transition-colors hover:bg-admin-surface-2
            ${isDragging ? 'lesson-row--dragging' : ''}
            ${lesson.isLocked ? 'lesson-row--locked' : ''}
          `}
          onClick={handleClick}
        >

          <button
            {...listeners}
            {...attributes}
            className="lesson-drag-handle shrink-0 w-5 h-5 flex items-center justify-center"
            aria-label={`Přetáhnout lekci ${lesson.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <i className="ti ti-grip-vertical text-[16px]" aria-hidden="true" />
          </button>

          <button
            onClick={toggleLock}
            title={lesson.isLocked ? 'Odemknout lekci' : 'Zamknout lekci'}
            className="shrink-0"
          >
            <i className={`ti ${lesson.isLocked ? 'ti-lock text-admin-danger' : 'ti-lock-open text-admin-text-muted'} text-[16px]`} aria-hidden="true" />
          </button>

          <span className={`lesson-title flex-1 text-admin-sm font-medium truncate ${lesson.isLocked ? 'text-admin-text-muted' : 'text-admin-text'}`}>
            {lesson.title}
            {lesson.isTemplate && (
              <span className="ml-2 text-admin-xs text-admin-text-muted border border-admin-border px-1.5 py-0.5 rounded-full">šablona</span>
            )}
          </span>

          <span className="text-admin-xs text-admin-text-muted shrink-0">{lesson.blocksCount} bloků</span>

          <div onClick={(e) => e.stopPropagation()}>
            <LessonRowOrderButtons lessonId={lesson.id} isFirst={isFirst} isLast={isLast} />
          </div>

          <LessonRowActions lesson={lesson} />
        </div>
      )}
    </SortableItem>
  );
}
