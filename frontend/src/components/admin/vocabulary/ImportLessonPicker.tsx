'use client';

import { useState } from 'react';
import { useLessonsForImport } from '@/lib/vocabulary/vocabulary.api';
import { LessonForImport } from '@/lib/vocabulary/vocabulary.types';

interface Props {
  excludeLessonId: string;
  onSelect: (lesson: LessonForImport) => void;
  onClose: () => void;
}

export function ImportLessonPicker({ excludeLessonId, onSelect, onClose }: Props) {
  const { data: lessons, isLoading } = useLessonsForImport(excludeLessonId);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = (lessons ?? []).filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  const selected = lessons?.find((l) => l.id === selectedId);

  return (
    <div className="flex flex-col gap-admin-md">
      <p className="text-admin-sm text-admin-text-muted">Vyberte lekci ze které chcete importovat:</p>

      <div className="relative">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted text-[14px]" aria-hidden="true" />
        <input
          className="w-full pl-8 pr-3 py-1.5 bg-admin-surface-2 border border-admin-border rounded-admin-sm text-admin-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:border-admin-primary"
          placeholder="Hledat lekce..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
        {isLoading && <p className="text-admin-sm text-admin-text-muted">Načítám lekce...</p>}
        {!isLoading && filtered.length === 0 && <p className="text-admin-sm text-admin-text-muted italic">Žádné lekce nenalezeny.</p>}
        {filtered.map((lesson) => (
          <label
            key={lesson.id}
            className={`flex items-center gap-3 p-admin-md rounded-admin-md border cursor-pointer transition-colors ${selectedId === lesson.id ? 'border-admin-primary bg-admin-surface-2' : 'border-admin-border hover:border-admin-primary hover:bg-admin-surface-2'}`}
          >
            <input
              type="radio"
              name="import-lesson"
              value={lesson.id}
              checked={selectedId === lesson.id}
              onChange={() => setSelectedId(lesson.id)}
              className="accent-admin-primary shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-admin-sm font-medium text-admin-text truncate">{lesson.title}</p>
              <p className="text-admin-xs text-admin-text-muted">{lesson.courseTitle} · {lesson.wordCount} slovíček</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-admin-sm pt-admin-sm border-t border-admin-border">
        <button onClick={onClose} className="px-admin-md py-1.5 text-admin-sm text-admin-text-muted hover:text-admin-text">Zrušit</button>
        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selectedId}
          className="px-admin-md py-1.5 text-admin-sm bg-admin-primary text-white rounded-admin-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-admin-primary-h transition-colors"
        >
          Dále →
        </button>
      </div>
    </div>
  );
}
