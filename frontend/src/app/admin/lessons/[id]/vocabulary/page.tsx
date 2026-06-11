'use client';

import { use, useEffect, useState } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { fetchLessonInfo } from '@/lib/lesson-content/lesson-content.api';
import { useUIStore } from '@/lib/stores/ui.store';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { LessonNavTabs } from '@/components/admin/common/LessonNavTabs';
import { VocabularyToolbar } from '@/components/admin/vocabulary/VocabularyToolbar';
import { VocabularyTable } from '@/components/admin/vocabulary/VocabularyTable';
import { AddWordModal } from '@/components/admin/vocabulary/AddWordModal';
import { EditWordModal } from '@/components/admin/vocabulary/EditWordModal';
import { DeleteWordModal } from '@/components/admin/vocabulary/DeleteWordModal';
import { ImportVocabularyModal } from '@/components/admin/vocabulary/ImportVocabularyModal';

export default function VocabularyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: lessonId } = use(params);
  const { isLoading } = useRequireAdmin();
  const { openModal } = useUIStore();
  const [meta, setMeta] = useState({ lessonTitle: '', courseId: '', courseTitle: '' });

  useEffect(() => {
    fetchLessonInfo(lessonId).then((info) =>
      setMeta({ lessonTitle: info.lessonTitle, courseId: info.courseId, courseTitle: info.courseTitle })
    );
  }, [lessonId]);

  if (isLoading) return null;

  return (
    <>
      <AdminPageLayout
        title="Slovíčka lekce"
        breadcrumb={[
          { label: 'Kurzy', href: '/admin/courses' },
          { label: meta.courseTitle || 'Kurz', href: meta.courseId ? `/admin/courses/${meta.courseId}/lessons` : '/admin/courses' },
          { label: meta.lessonTitle || 'Lekce', href: `/admin/lessons/${lessonId}/content` },
          { label: 'Slovíčka' },
        ]}
        actions={
          <>
            <AdminButton variant="ghost" icon="ti-download" onClick={() => openModal('importVocabulary', {})}>
              Importovat
            </AdminButton>
            <AdminButton variant="primary" icon="ti-plus" onClick={() => openModal('addWord', {})}>
              Nové slovíčko
            </AdminButton>
          </>
        }
      >
        <LessonNavTabs lessonId={lessonId} />
        <VocabularyToolbar />
        <VocabularyTable lessonId={lessonId} />
      </AdminPageLayout>

      <AddWordModal lessonId={lessonId} />
      <EditWordModal lessonId={lessonId} />
      <DeleteWordModal lessonId={lessonId} />
      <ImportVocabularyModal lessonId={lessonId} />
    </>
  );
}
