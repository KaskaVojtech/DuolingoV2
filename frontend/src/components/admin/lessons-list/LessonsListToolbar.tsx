'use client';

import Link from 'next/link';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';
import { useUIStore } from '@/lib/stores/ui.store';

interface LessonsListToolbarProps { courseId: string; }

export function LessonsListToolbar({ courseId }: LessonsListToolbarProps) {
  const { courseTitle } = useLessonsListStore();
  const openModal = useUIStore((s) => s.openModal);

  return (
    <div className="flex items-center justify-between gap-admin-md h-[48px] px-admin-md bg-toolbar-bg border-b border-toolbar-border mb-admin-md">
      <AdminButton icon="ti-plus" onClick={() => openModal('addLesson', { courseId })}>
        Přidat lekci
      </AdminButton>
      <Link
        href="/admin/courses"
        className="text-admin-xs text-admin-text-muted hover:text-admin-text transition-colors"
      >
        Kurz: <span className="text-admin-text">{courseTitle}</span>
      </Link>
    </div>
  );
}
