'use client';

import { useEffect, use } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { fetchLessons, fetchCourseTitleForLessons } from '@/lib/lessons-list/lessons-list.api';
import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { LessonsListToolbar } from '@/components/admin/lessons-list/LessonsListToolbar';
import { LessonsSortableList } from '@/components/admin/lessons-list/LessonsSortableList';
import { LessonDrawer } from '@/components/admin/lessons-list/lesson-drawer/LessonDrawer';
import { AddLessonModal } from '@/components/admin/lessons-list/add-lesson-modal/AddLessonModal';
import { DeleteLessonModal } from '@/components/admin/lessons-list/delete-lesson-modal/DeleteLessonModal';
import { SaveAsTemplateModal } from '@/components/admin/courses/SaveAsTemplateModal';

export default function LessonsListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading } = useRequireAdmin();
  const { setLessons, courseTitle } = useLessonsListStore();

  useEffect(() => {
    Promise.all([fetchLessons(id), fetchCourseTitleForLessons(id)]).then(([lessons, title]) => {
      setLessons(lessons, title);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) return null;

  return (
    <AdminPageLayout
      title="Lekce kurzu"
      breadcrumb={[
        { label: 'Kurzy', href: '/admin/courses' },
        { label: courseTitle || '…', href: `/admin/courses/${id}/settings` },
        { label: 'Lekce' },
      ]}
    >
      <LessonsListToolbar courseId={id} />
      <LessonsSortableList courseId={id} />
      <LessonDrawer />
      <AddLessonModal />
      <DeleteLessonModal />
      <SaveAsTemplateModal />
    </AdminPageLayout>
  );
}
