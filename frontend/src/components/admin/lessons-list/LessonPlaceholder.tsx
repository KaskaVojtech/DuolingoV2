'use client';

import { useUIStore } from '@/lib/stores/ui.store';

interface Props { courseId: string; }

export function LessonPlaceholder({ courseId }: Props) {
  const openModal = useUIStore((s) => s.openModal);

  return (
    <button
      onClick={() => openModal('addLesson', { courseId })}
      className="flex items-center justify-center gap-2 w-full py-4 border-b border-dashed border-admin-border text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2 transition-colors"
    >
      <i className="ti ti-plus text-[18px]" aria-hidden="true" />
      <span className="text-admin-sm">Přidat lekci</span>
    </button>
  );
}
