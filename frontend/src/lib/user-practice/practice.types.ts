/**
 * Practice types and metadata (exercise types, questions, pairs) for the user side.
 */
import { PracticeType, UserVocabWord } from '@/lib/user-auth/user-lesson.api';

export type PracticeMode = 'sequential' | 'memory' | 'match';

export interface PracticeTypeMeta {
  type: PracticeType;
  label: string;
  description: string;
  icon: string;
  color: string;
  mode: PracticeMode;
}

export const PRACTICE_META: Record<PracticeType, PracticeTypeMeta> = {
  vocab_multiple_choice: { type: 'vocab_multiple_choice', label: 'Výběr z možností', description: 'Vyber správný překlad', icon: 'ti-list-check', color: '#5b7cfa', mode: 'sequential' },
  vocab_translation:     { type: 'vocab_translation',     label: 'Překlad slovíček', description: 'Napiš překlad', icon: 'ti-language', color: '#0ea5e9', mode: 'sequential' },
  vocab_memory:          { type: 'vocab_memory',          label: 'Pexeso', description: 'Spáruj dvojice', icon: 'ti-cards', color: '#a855f7', mode: 'memory' },
  vocab_drag:            { type: 'vocab_drag',            label: 'Přiřazování', description: 'Spoj slovo s překladem', icon: 'ti-arrows-join', color: '#22c79a', mode: 'match' },
  vocab_spelling:        { type: 'vocab_spelling',        label: 'Hláskování', description: 'Poslechni a napiš', icon: 'ti-abc', color: '#f59e0b', mode: 'sequential' },
  sent_fill_in:          { type: 'sent_fill_in',          label: 'Doplň do věty', description: 'Doplň chybějící slovo', icon: 'ti-input-search', color: '#22c79a', mode: 'sequential' },
  sent_word_order:       { type: 'sent_word_order',       label: 'Seřaď větu', description: 'Seřaď slova ve větě', icon: 'ti-reorder', color: '#c44a2a', mode: 'sequential' },
  sent_translation:      { type: 'sent_translation',      label: 'Přelož větu', description: 'Napiš překlad věty', icon: 'ti-text-caption', color: '#0ea5e9', mode: 'sequential' },
  listen_multiple_choice:{ type: 'listen_multiple_choice',label: 'Poslech — výběr', description: 'Poslechni a vyber', icon: 'ti-headphones', color: '#f59e0b', mode: 'sequential' },
  listen_write:          { type: 'listen_write',          label: 'Poslech — psaní', description: 'Poslechni a napiš', icon: 'ti-ear', color: '#ec4899', mode: 'sequential' },
};

interface BaseQuestion { id: string; prompt: string; }

export interface ChoiceQuestion extends BaseQuestion {
  kind: 'choice';
  audioUrl?: string;
  options: string[];
  correct: string;
}
export interface InputQuestion extends BaseQuestion {
  kind: 'input';
  audioUrl?: string;
  accept: string[];
  showPrompt: boolean;
}
export interface OrderQuestion extends BaseQuestion {
  kind: 'order';
  words: string[];
}
export interface FillQuestion extends BaseQuestion {
  kind: 'fill';
  before: string;
  after: string;
  accept: string[];
}

export type PracticeQuestion = ChoiceQuestion | InputQuestion | OrderQuestion | FillQuestion;

export interface MemoryPair { id: string; en: string; cs: string; }

export interface PracticeWord extends UserVocabWord {}
