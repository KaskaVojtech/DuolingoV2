'use client';

import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';
import { SlideDrawer } from '@/components/admin/common/SlideDrawer';
import { LessonRenameField } from './LessonRenameField';
import { CompletionSection } from './CompletionSection';
import { LockSection } from './LockSection';

export function LessonDrawer() {
  const { isDrawerOpen, drawerLessonId, lessons, closeDrawer } = useLessonsListStore();
  const lesson = lessons.find((l) => l.id === drawerLessonId);

  return (
    <SlideDrawer isOpen={isDrawerOpen} onClose={closeDrawer} title="Nastavení lekce">
      {lesson && (
        <div className="flex flex-col gap-admin-lg">
          <LessonRenameField lessonId={lesson.id} currentTitle={lesson.title} />
          <CompletionSection lesson={lesson} />
          <LockSection lesson={lesson} />
        </div>
      )}
    </SlideDrawer>
  );
}
