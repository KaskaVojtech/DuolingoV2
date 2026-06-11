'use client';

import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';
import { SortableList } from '@/components/admin/common/sortable/SortableList';
import { LessonRow } from './LessonRow';
import { LessonPlaceholder } from './LessonPlaceholder';

interface Props { courseId: string; }

export function LessonsSortableList({ courseId }: Props) {
  const { lessons, reorderLessons } = useLessonsListStore();

  return (
    <div className="bg-admin-surface border border-admin-border rounded-admin-md overflow-hidden">
      <SortableList items={lessons} onReorder={reorderLessons}>
        {lessons.map((lesson, idx) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            isFirst={idx === 0}
            isLast={idx === lessons.length - 1}
          />
        ))}
      </SortableList>
      <LessonPlaceholder courseId={courseId} />
    </div>
  );
}
