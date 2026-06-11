'use client';

import { useEffect, useState } from 'react';
import { useVocabularyStore } from '@/lib/vocabulary/vocabulary.store';
import { PartOfSpeech, POS_LABELS } from '@/lib/vocabulary/vocabulary.types';

export function VocabularyToolbar() {
  const { filter, setFilter, resetFilter } = useVocabularyStore();
  const [searchVal, setSearchVal] = useState(filter.searchQuery);

  useEffect(() => {
    const t = setTimeout(() => setFilter({ searchQuery: searchVal }), 300);
    return () => clearTimeout(t);
  }, [searchVal, setFilter]);

  const SORT_OPTIONS = [
    { v: 'wordEn-asc', label: 'A–Z (EN)' },
    { v: 'wordCs-asc', label: 'A–Z (CS)' },
    { v: 'pos-asc', label: 'Slovní druh' },
    { v: 'addedAt-desc', label: 'Datum přidání' },
  ];

  return (
    <div className="flex items-center gap-admin-sm flex-wrap mb-admin-md">

      <div className="relative flex-1 min-w-[200px]">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-[14px]" aria-hidden="true" />
        <input
          className="w-full pl-8 pr-3 py-1.5 bg-admin-surface-2 border border-admin-border rounded-admin-sm text-admin-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:border-admin-primary"
          placeholder="Hledat slovíčka..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>

      <select
        className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-sm py-1.5 text-admin-xs text-admin-text"
        value={filter.pos ?? ''}
        onChange={(e) => setFilter({ pos: (e.target.value as PartOfSpeech) || null })}
      >
        <option value="">Všechny slovní druhy</option>
        {(Object.entries(POS_LABELS) as [PartOfSpeech, string][]).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>

      <select
        className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-sm py-1.5 text-admin-xs text-admin-text"
        value={filter.importedOnly ? 'imported' : 'all'}
        onChange={(e) => setFilter({ importedOnly: e.target.value === 'imported' })}
      >
        <option value="all">Vše</option>
        <option value="imported">Pouze importovaná</option>
      </select>

      <select
        className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-sm py-1.5 text-admin-xs text-admin-text"
        value={`${filter.sortField}-${filter.sortDirection}`}
        onChange={(e) => {
          const [field, dir] = e.target.value.split('-');
          setFilter({ sortField: field as typeof filter.sortField, sortDirection: dir as 'asc' | 'desc' });
        }}
      >
        {SORT_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
      </select>

      <button onClick={resetFilter} className="text-admin-xs text-admin-text-muted hover:text-admin-text" title="Resetovat filtry">
        <i className="ti ti-refresh text-[14px]" aria-hidden="true" />
      </button>
    </div>
  );
}
