'use client';

import { useCourseLessons } from '@/lib/template-import/template-import.api';
import { CoursePreviewLessonRow } from './CoursePreviewLessonRow';
import { DropZoneIndicator } from './DropZoneIndicator';

interface Props {
  courseId: string;
  onImport: (afterOrder: number) => void;
}

export function CoursePreviewWithCursor({ courseId, onImport }: Props) {
  const { data: lessons, isLoading } = useCourseLessons(courseId);

  if (isLoading) return <p className="text-admin-sm text-admin-text-muted p-admin-xl">Načítám lekce kurzu...</p>;

  const sorted = [...(lessons ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="course-preview">
      <h3 className="text-admin-base font-medium text-admin-text mb-admin-lg">Lekce kurzu</h3>

      <DropZoneIndicator afterOrder={0} onInsert={onImport} />

      {sorted.map((lesson) => (
        <div key={lesson.id}>
          <CoursePreviewLessonRow lesson={lesson} />
          <DropZoneIndicator afterOrder={lesson.order} onInsert={onImport} />
        </div>
      ))}

      {sorted.length === 0 && (
        <p className="text-admin-sm text-admin-text-muted text-center py-admin-xl">
          Kurz zatím nemá žádné lekce — lekce budou přidány na začátek.
        </p>
      )}
    </div>
  );
}
