'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { useTemplateImportStore } from '@/lib/template-import/template-import.store';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { TemplateList } from '@/components/admin/template-import/TemplateList';
import { TemplatePreviewPanel } from '@/components/admin/template-import/TemplatePreviewPanel';
import { CoursePreviewWithCursor } from '@/components/admin/template-import/CoursePreviewWithCursor';

function TemplatesContent() {
  const { isLoading } = useRequireAdmin();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId') ?? '';
  const { phase, setCourseId, cancelPlacing, confirmImport, isImporting } = useTemplateImportStore();

  useEffect(() => {
    if (courseId) setCourseId(courseId);
  }, [courseId, setCourseId]);

  const handleImport = async (afterOrder: number) => {
    if (isImporting) return;
    await confirmImport(afterOrder);
    router.push(`/admin/courses/${courseId}/lessons`);
  };

  if (isLoading) return null;

  if (phase === 'placing') {
    return (
      <div className="placing-mode min-h-screen bg-admin-bg">
        <div className="placing-toolbar">
          <button
            onClick={cancelPlacing}
            className="flex items-center gap-2 text-admin-text-muted hover:text-admin-text transition-colors"
          >
            <i className="ti ti-arrow-left text-[14px]" aria-hidden="true" />
            Zpět na výběr
          </button>
          <span>Klikněte na místo, kam chcete lekce vložit</span>
          <AdminButton variant="ghost" onClick={cancelPlacing}>Zrušit</AdminButton>
        </div>

        <div className="pt-[48px]">
          <CoursePreviewWithCursor courseId={courseId} onImport={handleImport} />
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Import šablon"
      breadcrumb={[
        { label: 'Kurzy', href: '/admin/courses' },
        { label: 'Lekce', href: courseId ? `/admin/courses/${courseId}/lessons` : '/admin/lessons' },
        { label: 'Import šablon' },
      ]}
    >
      <div className="template-import">
        <TemplateList />
        <TemplatePreviewPanel />
      </div>
    </AdminPageLayout>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense>
      <TemplatesContent />
    </Suspense>
  );
}
