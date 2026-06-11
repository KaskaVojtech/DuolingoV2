'use client';

import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { LessonsToolbar } from '@/components/admin/global-lessons/LessonsToolbar';
import { LessonsTable } from '@/components/admin/global-lessons/LessonsTable';
import { LessonDetailPanel } from '@/components/admin/global-lessons/LessonDetailPanel';

export default function GlobalLessonsPage() {
  const { isLoading } = useRequireAdmin();
  if (isLoading) return null;

  return (
    <div className="flex flex-col">
      <LessonsToolbar />
      <div className="p-admin-2xl">
        <h1 className="text-admin-2xl font-medium text-admin-text mb-admin-xl">Správa lekcí</h1>
        <div className="bg-admin-surface border border-admin-border rounded-admin-md overflow-hidden">
          <LessonsTable />
        </div>
      </div>
      <LessonDetailPanel />
    </div>
  );
}
