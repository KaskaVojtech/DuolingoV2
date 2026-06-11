import { LessonVocabularyEntry, VocabularyFilter } from './vocabulary.types';

export function filterAndSortVocabulary(
  entries: LessonVocabularyEntry[],
  filter: VocabularyFilter,
): LessonVocabularyEntry[] {
  let result = [...entries];

  if (filter.searchQuery) {
    const q = filter.searchQuery.toLowerCase();
    result = result.filter(
      (e) =>
        e.word.wordEn.toLowerCase().includes(q) ||
        e.word.wordCs.toLowerCase().includes(q),
    );
  }

  if (filter.pos) {
    result = result.filter((e) => e.word.pos === filter.pos);
  }

  if (filter.importedOnly) {
    result = result.filter((e) => e.importedFromLessonId !== null);
  }

  result.sort((a, b) => {
    const dir = filter.sortDirection === 'asc' ? 1 : -1;
    switch (filter.sortField) {
      case 'wordEn': return a.word.wordEn.localeCompare(b.word.wordEn) * dir;
      case 'wordCs': return a.word.wordCs.localeCompare(b.word.wordCs) * dir;
      case 'pos':    return a.word.pos.localeCompare(b.word.pos) * dir;
      case 'addedAt': return (new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()) * dir;
    }
  });

  return result;
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'dnes';
  if (days === 1) return 'včera';
  if (days < 7) return `před ${days} dny`;
  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' });
}

export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text;
}
