'use client';

import { useState, useMemo } from 'react';
import { useLessonVocabularyForImport, useImportWords, useLessonVocabulary } from '@/lib/vocabulary/vocabulary.api';
import { useVocabularyStore } from '@/lib/vocabulary/vocabulary.store';
import { LessonForImport } from '@/lib/vocabulary/vocabulary.types';
import { PosBadge } from './PosBadge';

interface Props {
  sourceLesson: LessonForImport;
  currentLessonId: string;
  onBack: () => void;
  onClose: () => void;
}

export function ImportWordList({ sourceLesson, currentLessonId, onBack, onClose }: Props) {
  const { data: sourceWords, isLoading } = useLessonVocabularyForImport(sourceLesson.id);
  const { filter } = useVocabularyStore();
  const { data: currentEntries } = useLessonVocabulary(currentLessonId, filter);
  const { mutateAsync, isPending } = useImportWords(currentLessonId);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const currentWordIds = useMemo(() => new Set((currentEntries ?? []).map((e) => e.word.id)), [currentEntries]);

  const filtered = useMemo(() =>
    (sourceWords ?? []).filter((w) =>
      w.wordEn.toLowerCase().includes(search.toLowerCase()) ||
      w.wordCs.toLowerCase().includes(search.toLowerCase())
    ), [sourceWords, search]);

  const available = filtered.filter((w) => !currentWordIds.has(w.id));

  const toggleWord = (id: string) => {
    if (currentWordIds.has(id)) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(available.map((w) => w.id)));
  const clearAll = () => setSelectedIds(new Set());
  const allSelected = available.length > 0 && available.every((w) => selectedIds.has(w.id));

  const handleImport = async () => {
    if (selectedIds.size === 0) return;
    await mutateAsync({ sourceWordIds: Array.from(selectedIds), importedFromLessonId: sourceLesson.id });
    onClose();
  };

  return (
    <div className="flex flex-col gap-admin-md">

      <div className="flex items-center gap-admin-sm">
        <div className="relative flex-1">
          <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-[14px]" aria-hidden="true" />
          <input
            className="w-full pl-8 pr-3 py-1.5 bg-admin-surface-2 border border-admin-border rounded-admin-sm text-admin-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:border-admin-primary"
            placeholder="Hledat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={allSelected ? clearAll : selectAll}
          className="flex items-center gap-1.5 px-admin-sm py-1.5 text-admin-xs text-admin-text-muted border border-admin-border rounded-admin-sm hover:border-admin-primary hover:text-admin-text transition-colors whitespace-nowrap"
        >
          <input type="checkbox" checked={allSelected} onChange={() => {}} className="accent-admin-primary pointer-events-none" />
          Vybrat vše
        </button>
      </div>

      <div className="flex flex-col max-h-72 overflow-y-auto border border-admin-border rounded-admin-md overflow-hidden">
        {isLoading && <p className="p-admin-md text-admin-sm text-admin-text-muted">Načítám slovíčka...</p>}
        {filtered.map((word) => {
          const alreadyIn = currentWordIds.has(word.id);
          const isChecked = selectedIds.has(word.id);
          return (
            <label
              key={word.id}
              className={`flex items-center gap-3 px-admin-md py-2 border-b border-admin-border last:border-0 transition-colors ${alreadyIn ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-admin-surface-2'}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                disabled={alreadyIn}
                onChange={() => toggleWord(word.id)}
                className="accent-admin-primary shrink-0"
              />
              <span className="text-admin-sm font-medium text-admin-text w-28 truncate">{word.wordEn}</span>
              <span className="text-admin-sm text-admin-text-muted flex-1 truncate">{word.wordCs}</span>
              <PosBadge pos={word.pos} />
              {alreadyIn && <span className="text-admin-xs text-admin-text-muted whitespace-nowrap">již v lekci</span>}
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-admin-sm">
        <span className="text-admin-xs text-admin-text-muted">Vybráno: {selectedIds.size} / {available.length}</span>
        <div className="flex gap-admin-sm">
          <button onClick={onBack} className="flex items-center gap-1.5 px-admin-md py-1.5 text-admin-sm text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-arrow-left text-[12px]" aria-hidden="true" /> Zpět
          </button>
          <button onClick={onClose} className="px-admin-md py-1.5 text-admin-sm text-admin-text-muted hover:text-admin-text">Zrušit</button>
          <button
            onClick={handleImport}
            disabled={selectedIds.size === 0 || isPending}
            className="px-admin-md py-1.5 text-admin-sm bg-admin-primary text-white rounded-admin-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-admin-primary-h transition-colors flex items-center gap-1.5"
          >
            {isPending && <i className="ti ti-loader-2 animate-spin text-[13px]" aria-hidden="true" />}
            Importovat
          </button>
        </div>
      </div>
    </div>
  );
}
