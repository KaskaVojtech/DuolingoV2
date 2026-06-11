'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { LessonNavTabs } from '@/components/admin/common/LessonNavTabs';
import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { useUIStore } from '@/lib/stores/ui.store';

export function BlocksListToolbar() {
  const { blocks, lessonTitle, courseId, courseTitle } = useLessonContentStore();
  const openModal = useUIStore((s) => s.openModal);
  const pathname = usePathname();

  const lessonId = pathname.split('/')[3] ?? '';

  return (
    <div className="flex items-center gap-admin-md h-[48px] px-admin-md bg-toolbar-bg border-b border-toolbar-border mb-admin-md">

      <div className="flex items-center gap-1 text-admin-xs text-admin-text-muted shrink-0">
        <Link href="/admin/courses" className="hover:text-admin-text transition-colors">{courseTitle || 'Kurzy'}</Link>
        <i className="ti ti-chevron-right text-[10px]" aria-hidden="true" />
        <Link href={`/admin/courses/${courseId}/lessons`} className="hover:text-admin-text transition-colors">{lessonTitle || 'Lekce'}</Link>
      </div>

      {lessonId && <LessonNavTabs lessonId={lessonId} />}

      <div className="ml-auto">
        <AdminButton icon="ti-plus" onClick={() => openModal('addBlock', {})}>Nový blok</AdminButton>
      </div>
    </div>
  );
}
