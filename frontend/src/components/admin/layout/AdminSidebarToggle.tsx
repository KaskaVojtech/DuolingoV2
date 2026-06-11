'use client';

import { useSidebarStore } from '@/lib/stores/sidebar.store';

export function AdminSidebarToggle() {
  const { isExpanded, toggle } = useSidebarStore();

  return (
    <button
      onClick={toggle}
      aria-label={isExpanded ? 'Sbalit sidebar' : 'Rozbalit sidebar'}
      className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-admin-surface-2 border border-admin-border rounded-full z-10 hover:bg-admin-surface transition-colors"
    >
      <i
        className={`ti ti-chevron-left text-admin-text-muted admin-sidebar__toggle-icon ${isExpanded ? '' : 'admin-sidebar__toggle-icon--rotated'}`}
        aria-hidden="true"
      />
    </button>
  );
}
