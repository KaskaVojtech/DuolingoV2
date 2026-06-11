'use client';

import { useRef, useState } from 'react';
import { LessonListItem } from '@/lib/global-lessons/global-lessons.types';
import { useGlobalLessonsStore } from '@/lib/global-lessons/global-lessons.store';
import { useRenameLesson } from '@/lib/global-lessons/global-lessons.api';
import { formatRelativeDate } from '@/lib/global-lessons/global-lessons.utils';
import { LessonCourseBadges } from './LessonCourseBadges';
import { LessonTemplateBadge } from './LessonTemplateBadge';

interface Props { lesson: LessonListItem }

export function LessonTableRow({ lesson }: Props) {
  const { selectLesson } = useGlobalLessonsStore();
  const { mutate: rename } = useRenameLesson();
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(lesson.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const startRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRenameVal(lesson.title);
    setRenaming(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const submitRename = () => {
    if (renameVal.trim() && renameVal.trim() !== lesson.title) {
      rename({ lessonId: lesson.id, title: renameVal.trim() });
    }
    setRenaming(false);
  };

  const handleRenameKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submitRename();
    if (e.key === 'Escape') setRenaming(false);
  };

  return (
    <tr className="cursor-pointer" onClick={() => selectLesson(lesson.id)}>

      <td className="px-admin-md py-2 border-b border-admin-border">
        {renaming ? (
          <input
            ref={inputRef}
            className="lesson-rename-input"
            value={renameVal}
            onChange={(e) => setRenameVal(e.target.value)}
            onBlur={submitRename}
            onKeyDown={handleRenameKey}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex items-center text-admin-text">
            {lesson.title}
            {lesson.isTemplate && <LessonTemplateBadge />}
          </span>
        )}
      </td>

      <td className="px-admin-md py-2 border-b border-admin-border" style={{ width: 200 }}>
        <LessonCourseBadges courseIds={lesson.courseIds} courseTitles={lesson.courseTitles} />
      </td>

      <td className="px-admin-md py-2 border-b border-admin-border" style={{ width: 100 }}>
        <div className="completion-bar">
          <div className="completion-bar__track">
            <div className="completion-bar__fill" style={{ width: `${lesson.completionAvg}%` }} />
          </div>
          <span className="completion-bar__label">{lesson.completionAvg}%</span>
        </div>
      </td>

      <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted" style={{ width: 60 }}>
        {lesson.blocksCount}
      </td>

      <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted" style={{ width: 100 }}>
        {formatRelativeDate(lesson.updatedAt)}
      </td>

      <td className="px-admin-md py-2 border-b border-admin-border" style={{ width: 120 }}>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={startRename}
            className="px-2 py-1 text-admin-xs text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2 rounded-admin-sm transition-colors"
            title="Přejmenovat"
          >
            <i className="ti ti-pencil text-[13px]" aria-hidden="true" />
          </button>
          <button
            onClick={() => selectLesson(lesson.id)}
            className="px-2 py-1 text-admin-xs text-admin-primary hover:bg-admin-surface-2 rounded-admin-sm transition-colors"
          >
            Detail
          </button>
        </div>
      </td>
    </tr>
  );
}
