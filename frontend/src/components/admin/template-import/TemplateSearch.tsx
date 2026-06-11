'use client';

import { useEffect, useState } from 'react';
import { useTemplateImportStore } from '@/lib/template-import/template-import.store';

export function TemplateSearch() {
  const { searchQuery, setSearchQuery } = useTemplateImportStore();
  const [local, setLocal] = useState(searchQuery);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(local), 300);
    return () => clearTimeout(t);
  }, [local, setSearchQuery]);

  return (
    <div className="relative">
      <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-[14px]" aria-hidden="true" />
      <input
        className="w-full pl-8 pr-3 py-2 bg-admin-surface-2 border border-admin-border rounded-admin-sm text-admin-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:border-admin-primary transition-colors"
        placeholder="Hledat šablony..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
    </div>
  );
}
