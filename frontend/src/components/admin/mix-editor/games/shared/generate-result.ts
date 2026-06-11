import { VocabularyWord } from '@/lib/vocabulary/vocabulary.types';

export type GenerateResult<T> = { ok: true; data: T } | { ok: false; reason: string };

export interface LlmSentence {

  word?: string;
  sentence: string;

  hint?: string;
}

export interface GenerateContext {

  words: VocabularyWord[];
  lessonId: string;

  requestSentences: (kind: 'fill_in' | 'word_order', count: number) => Promise<LlmSentence[]>;
}

export function ok<T>(data: T): GenerateResult<T> {
  return { ok: true, data };
}

export function fail<T>(reason: string): GenerateResult<T> {
  return { ok: false, reason };
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
