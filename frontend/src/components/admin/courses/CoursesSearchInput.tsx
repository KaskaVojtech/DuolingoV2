'use client';

import { useRef } from 'react';
import { useCoursesStore } from '@/lib/courses/courses.store';

export function CoursesSearchInput() {
  const { setSearchQuery } = useCoursesStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(e.target.value);
    }, 300);
  };

  return (
    <div className="relative flex-1 max-w-[320px]">
      <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-[14px]" aria-hidden="true" />
      <input
        type="search"
        placeholder="Hledat kurzy…"
        onChange={handleChange}
        className="w-full bg-admin-surface-2 border border-admin-border rounded-admin-sm pl-8 pr-admin-md py-2 text-admin-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:border-admin-primary transition-colors"
      />
    </div>
  );
}
