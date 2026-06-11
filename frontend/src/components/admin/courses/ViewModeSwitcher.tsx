'use client';

import { useCoursesStore } from '@/lib/courses/courses.store';
import { ViewMode } from '@/lib/courses/courses.types';

const MODES: { mode: ViewMode; icon: string; title: string }[] = [
  { mode: 'grid-large', icon: 'ti-layout-grid',     title: 'Velké dlaždice' },
  { mode: 'grid-small', icon: 'ti-layout-grid-add',  title: 'Malé dlaždice' },
  { mode: 'list',       icon: 'ti-list',             title: 'Seznam' },
];

export function ViewModeSwitcher() {
  const { viewMode, setViewMode } = useCoursesStore();

  return (
    <div className="flex border border-admin-border rounded-admin-sm overflow-hidden">
      {MODES.map(({ mode, icon, title }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          title={title}
          aria-label={title}
          className={`px-3 py-2 text-[16px] transition-colors duration-150 ${
            viewMode === mode
              ? 'bg-[image:var(--gradient-brand-soft)] text-admin-primary'
              : 'text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2'
          }`}
        >
          <i className={`ti ${icon}`} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
