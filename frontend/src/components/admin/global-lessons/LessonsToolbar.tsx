'use client';

import { useCallback, useEffect, useState } from 'react';
import { useGlobalLessonsStore } from '@/lib/global-lessons/global-lessons.store';
import { useLessons } from '@/lib/global-lessons/global-lessons.api';
import { fetchCourses } from '@/lib/courses/courses.api';
import { LessonsFilter } from '@/lib/global-lessons/global-lessons.types';

export function LessonsToolbar() {
  const { filter, setFilter, resetFilter } = useGlobalLessonsStore();
  const [searchVal, setSearchVal] = useState(filter.searchQuery);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => { fetchCourses().then(setCourses); }, []);

  useEffect(() => {
    const t = setTimeout(() => setFilter({ searchQuery: searchVal }), 300);
    return () => clearTimeout(t);
  }, [searchVal, setFilter]);

  return (
    <div className="flex items-center gap-admin-sm px-admin-lg h-[56px] bg-toolbar-bg border-b border-toolbar-border sticky top-0 z-30">

      <div className="relative flex-1 max-w-[280px]">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-[14px]" aria-hidden="true" />
        <input
          className="w-full pl-8 pr-3 py-1.5 bg-admin-surface-2 border border-admin-border rounded-admin-sm text-admin-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:border-admin-primary"
          placeholder="Hledat lekci..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>

      <select
        className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-sm py-1.5 text-admin-xs text-admin-text"
        value={filter.courseId ?? ''}
        onChange={(e) => setFilter({ courseId: e.target.value || null })}
      >
        <option value="">Všechny kurzy</option>
        <option value="standalone">Standalone</option>
        {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>

      <select
        className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-sm py-1.5 text-admin-xs text-admin-text"
        value={filter.isTemplate === null ? '' : String(filter.isTemplate)}
        onChange={(e) => setFilter({ isTemplate: e.target.value === '' ? null : e.target.value === 'true' })}
      >
        <option value="">Vše</option>
        <option value="true">Šablony</option>
        <option value="false">Běžné lekce</option>
      </select>

      <select
        className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-sm py-1.5 text-admin-xs text-admin-text"
        value={`${filter.sortField}-${filter.sortDirection}`}
        onChange={(e) => {
          const [field, dir] = e.target.value.split('-') as [LessonsFilter['sortField'], 'asc' | 'desc'];
          setFilter({ sortField: field, sortDirection: dir });
        }}
      >
        <option value="title-asc">Název A–Z</option>
        <option value="title-desc">Název Z–A</option>
        <option value="updatedAt-desc">Naposledy upraveno</option>
        <option value="createdAt-desc">Datum vytvoření</option>
        <option value="completionAvg-desc">Průměrná dokončenost</option>
      </select>

      <button onClick={resetFilter} className="text-admin-xs text-admin-text-muted hover:text-admin-text" title="Resetovat filtry">
        <i className="ti ti-refresh text-[14px]" aria-hidden="true" />
      </button>
    </div>
  );
}
