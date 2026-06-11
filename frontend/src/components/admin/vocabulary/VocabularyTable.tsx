'use client';

import { useLessonVocabulary } from '@/lib/vocabulary/vocabulary.api';
import { useVocabularyStore } from '@/lib/vocabulary/vocabulary.store';
import { VocabularyTableRow } from './VocabularyTableRow';
import { VocabularyPlaceholder } from './VocabularyPlaceholder';

interface Props { lessonId: string }

export function VocabularyTable({ lessonId }: Props) {
  const { filter } = useVocabularyStore();
  const { data: entries, isLoading } = useLessonVocabulary(lessonId, filter);

  const COLUMNS = [
    { label: 'Anglicky', field: 'wordEn' },
    { label: 'Česky', field: 'wordCs' },
    { label: 'Slovní druh', field: 'pos', width: 130 },
    { label: 'Příklad', field: null, width: 200 },
    { label: 'Zdroj', field: null, width: 140 },
    { label: 'Přidáno', field: 'addedAt', width: 100 },
    { label: 'Akce', field: null, width: 80 },
  ];

  return (
    <div className="bg-admin-surface border border-admin-border rounded-admin-md overflow-hidden">
      <table className="vocabulary-table">
        <thead>
          <tr>
            {COLUMNS.map(({ label, width }) => (
              <th key={label} style={width ? { width } : undefined}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr><td colSpan={7} className="px-admin-md py-admin-xl text-center text-admin-sm text-admin-text-muted">Načítám slovíčka...</td></tr>
          )}
          {!isLoading && (entries?.length ?? 0) === 0 && (
            <tr><td colSpan={7} className="px-admin-md py-admin-xl text-center text-admin-sm text-admin-text-muted italic">Lekce zatím nemá žádná slovíčka.</td></tr>
          )}
          {entries?.map((entry) => (
            <VocabularyTableRow key={entry.id} entry={entry} />
          ))}
        </tbody>
      </table>
      <VocabularyPlaceholder />
    </div>
  );
}
