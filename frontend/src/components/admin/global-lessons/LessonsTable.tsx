'use client';

import { useGlobalLessonsStore } from '@/lib/global-lessons/global-lessons.store';
import { useLessons } from '@/lib/global-lessons/global-lessons.api';
import { LessonTableRow } from './LessonTableRow';
import { LessonsFilter } from '@/lib/global-lessons/global-lessons.types';

const SORT_COLUMNS: { field: LessonsFilter['sortField']; label: string }[] = [
  { field: 'title', label: 'Název lekce' },
];

export function LessonsTable() {
  const { filter, setFilter } = useGlobalLessonsStore();
  const { data, isLoading, isError } = useLessons(filter);

  const toggleSort = (field: LessonsFilter['sortField']) => {
    if (filter.sortField === field) {
      setFilter({ sortDirection: filter.sortDirection === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilter({ sortField: field, sortDirection: 'asc' });
    }
  };

  const SortIcon = ({ field }: { field: LessonsFilter['sortField'] }) => (
    <i
      className={`ti sort-icon ${filter.sortField === field ? (filter.sortDirection === 'asc' ? 'ti-arrow-up' : 'ti-arrow-down') : 'ti-arrows-sort'} text-[11px]`}
      aria-hidden="true"
    />
  );

  return (
    <div>
      <table className="lessons-table">
        <thead>
          <tr>
            <th className={filter.sortField === 'title' ? 'th--active' : ''} onClick={() => toggleSort('title')}>
              Název lekce <SortIcon field="title" />
            </th>
            <th style={{ width: 200 }}>Kurzy</th>
            <th style={{ width: 100 }} className={filter.sortField === 'completionAvg' ? 'th--active' : ''} onClick={() => toggleSort('completionAvg')}>
              Avg % <SortIcon field="completionAvg" />
            </th>
            <th style={{ width: 60 }}>Bloků</th>
            <th style={{ width: 100 }} className={filter.sortField === 'updatedAt' ? 'th--active' : ''} onClick={() => toggleSort('updatedAt')}>
              Upraveno <SortIcon field="updatedAt" />
            </th>
            <th style={{ width: 120 }}>Akce</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr><td colSpan={6} className="px-admin-md py-admin-xl text-center text-admin-text-muted text-admin-sm">Načítám...</td></tr>
          )}
          {isError && (
            <tr><td colSpan={6} className="px-admin-md py-admin-xl text-center text-admin-text-muted text-admin-sm">Nepodařilo se načíst lekce. Backend endpoint pravděpodobně není dostupný.</td></tr>
          )}
          {!isLoading && !isError && data?.items.length === 0 && (
            <tr><td colSpan={6} className="px-admin-md py-admin-xl text-center text-admin-text-muted text-admin-sm">Žádné lekce neodpovídají filtrům.</td></tr>
          )}
          {data?.items.map((lesson) => (
            <LessonTableRow key={lesson.id} lesson={lesson} />
          ))}
        </tbody>
      </table>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-admin-md py-admin-md border-t border-admin-border">
          <span className="text-admin-xs text-admin-text-muted">
            {data.total} lekcí celkem
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter({ page: filter.page - 1 })}
              disabled={filter.page === 1}
              className="px-admin-sm py-1 text-admin-xs text-admin-text-muted hover:text-admin-text disabled:opacity-30"
            >
              ← Předchozí
            </button>
            <span className="text-admin-xs text-admin-text-muted">{filter.page} / {data.totalPages}</span>
            <button
              onClick={() => setFilter({ page: filter.page + 1 })}
              disabled={filter.page >= data.totalPages}
              className="px-admin-sm py-1 text-admin-xs text-admin-text-muted hover:text-admin-text disabled:opacity-30"
            >
              Další →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
