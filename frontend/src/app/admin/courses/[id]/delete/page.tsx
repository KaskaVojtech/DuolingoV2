'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { DeleteAccessCount } from '@/components/admin/course-delete/DeleteAccessCount';
import { DeleteLessonsList } from '@/components/admin/course-delete/DeleteLessonsList';
import { DeleteConfirmInput } from '@/components/admin/course-delete/DeleteConfirmInput';
import { DeletePostponedModal } from '@/components/admin/course-delete/DeletePostponedModal';
import { useDeletePreview, useDeleteCourse } from '@/lib/course-delete/course-delete.api';
import { useCourseDeleteStore, isConfirmValid } from '@/lib/course-delete/course-delete.store';
import { CourseDeleteResult } from '@/lib/course-delete/course-delete.types';

export default function DeleteCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading: authLoading } = useRequireAdmin();
  const router = useRouter();
  const { data: preview } = useDeletePreview(id);
  const { mutateAsync: deleteCourse } = useDeleteCourse();
  const store = useCourseDeleteStore();
  const [deleteResult, setDeleteResult] = useState<CourseDeleteResult | null>(null);

  useEffect(() => {
    store.reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (preview) store.setPreview(preview);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  const handleDelete = async () => {
    if (!preview) return;
    store.setSubmitting(true);
    try {
      const result = await deleteCourse({
        courseId: id,
        preserveLessonIds: [...store.preservedLessonIds],
      });
      setDeleteResult(result);
    } finally {
      store.setSubmitting(false);
    }
  };

  if (authLoading || !preview) return null;

  const canDelete = isConfirmValid(store.confirmInputValue, preview.courseTitle);

  return (
    <AdminPageLayout
      title={`Smazání kurzu: "${preview.courseTitle}"`}
      maxWidth="sm"
      breadcrumb={[
        { label: 'Kurzy', href: '/admin/courses' },
        { label: preview.courseTitle, href: `/admin/courses/${id}/lessons` },
        { label: 'Nastavení', href: `/admin/courses/${id}/settings` },
        { label: 'Smazání' },
      ]}
    >
      <DeleteAccessCount
        activeCount={preview.activeAccessCount}
        totalCount={preview.totalAccessCount}
      />

      <DeleteLessonsList
        lessons={preview.lessons}
        preservedIds={store.preservedLessonIds}
        onToggle={store.togglePreserveLesson}
        onPreserveAll={() =>
          store.preserveAll(preview.lessons.filter((l) => !l.isTemplate).map((l) => l.id))
        }
      />

      <DeleteConfirmInput
        courseTitle={preview.courseTitle}
        value={store.confirmInputValue}
        onChange={store.setConfirmInput}
      />

      <AdminButton
        variant="danger"
        disabled={!canDelete || store.isSubmitting}
        loading={store.isSubmitting}
        className="w-full justify-center"
        onClick={handleDelete}
      >
        Jsem si vědom co dělám — smazat kurz
      </AdminButton>

      {deleteResult && (
        <DeletePostponedModal
          result={deleteResult}
          onConfirm={() => router.push('/admin/courses')}
        />
      )}
    </AdminPageLayout>
  );
}
