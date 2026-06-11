'use client';

import { DeletedCoursesSort } from '@/lib/courses/deleted-courses.api';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  sort: DeletedCoursesSort;
  onSort: (s: DeletedCoursesSort) => void;
}

const SORTS: { value: DeletedCoursesSort; label: string; icon: string }[] = [
  { value: 'deleted_desc', label: 'Naposled smazané', icon: 'ti-clock' },
  { value: 'deleted_asc',  label: 'Nejdříve smazané',  icon: 'ti-clock-hour-3' },
  { value: 'title_asc',    label: 'A–Z',               icon: 'ti-sort-ascending-letters' },
  { value: 'title_desc',   label: 'Z–A',               icon: 'ti-sort-descending-letters' },
];

export function DeletedCoursesToolbar({ search, onSearch, sort, onSort }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-admin-md mb-admin-xl">

      <div className="relative flex-1 min-w-[220px]">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-[16px]" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Hledat smazaný kurz podle názvu…"
          className="admin-field pl-9"
          aria-label="Hledat smazaný kurz"
        />
      </div>

      <div className="flex flex-wrap gap-admin-xs">
        {SORTS.map((s) => {
          const active = sort === s.value;
          return (
            <button
              key={s.value}
              onClick={() => onSort(s.value)}
              className={`inline-flex items-center gap-1.5 px-admin-md py-1.5 rounded-full text-admin-xs font-bold border transition-all duration-150 ${
                active
                  ? 'bg-[image:var(--gradient-brand-soft)] text-admin-text border-admin-primary'
                  : 'bg-transparent text-admin-text-muted border-admin-border hover:text-admin-text hover:border-admin-primary'
              }`}
              aria-pressed={active}
            >
              <i className={`ti ${s.icon} text-[14px]`} aria-hidden="true" />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
