export type PracticeCategory = 'vocabulary' | 'sentences' | 'listening';

export const CATEGORY_LABELS: Record<PracticeCategory, string> = {
  vocabulary: 'Slovíčka',
  sentences:  'Věty',
  listening:  'Poslech',
};

export type PracticeType =
  | 'vocab_multiple_choice'
  | 'vocab_translation'
  | 'vocab_memory'
  | 'vocab_drag'
  | 'vocab_spelling'
  | 'sent_fill_in'
  | 'sent_word_order'
  | 'sent_translation'
  | 'listen_multiple_choice'
  | 'listen_write';

export const PRACTICE_CATEGORY: Record<PracticeType, PracticeCategory> = {
  vocab_multiple_choice:  'vocabulary',
  vocab_translation:      'vocabulary',
  vocab_memory:           'vocabulary',
  vocab_drag:             'vocabulary',
  vocab_spelling:         'vocabulary',
  sent_fill_in:           'sentences',
  sent_word_order:        'sentences',
  sent_translation:       'sentences',
  listen_multiple_choice: 'listening',
  listen_write:           'listening',
};

export interface PracticeTypeDefinition {
  type: PracticeType;
  label: string;
  description: string;
  icon: string;
  requiresAudio: boolean;
  requiresSentences: boolean;
}

export const PRACTICE_DEFINITIONS: Record<PracticeType, PracticeTypeDefinition> = {
  vocab_multiple_choice: {
    type: 'vocab_multiple_choice',
    label: 'Výběr z možností',
    description: 'Vyber správný překlad',
    icon: 'ti-list-check',
    requiresAudio: false,
    requiresSentences: false,
  },
  vocab_translation: {
    type: 'vocab_translation',
    label: 'Překlad',
    description: 'Napiš překlad slovíčka',
    icon: 'ti-language',
    requiresAudio: false,
    requiresSentences: false,
  },
  vocab_memory: {
    type: 'vocab_memory',
    label: 'Pexeso',
    description: 'Spáruj anglická a česká slova',
    icon: 'ti-cards',
    requiresAudio: false,
    requiresSentences: false,
  },
  vocab_drag: {
    type: 'vocab_drag',
    label: 'Přesouvání',
    description: 'Přetáhni slovíčko ke správnému překladu',
    icon: 'ti-drag-drop',
    requiresAudio: false,
    requiresSentences: false,
  },
  vocab_spelling: {
    type: 'vocab_spelling',
    label: 'Hláskování',
    description: 'Poslechni a napiš správně',
    icon: 'ti-abc',
    requiresAudio: true,
    requiresSentences: false,
  },
  sent_fill_in: {
    type: 'sent_fill_in',
    label: 'Doplň do věty',
    description: 'Doplň chybějící slovíčko',
    icon: 'ti-text-plus',
    requiresAudio: false,
    requiresSentences: true,
  },
  sent_word_order: {
    type: 'sent_word_order',
    label: 'Seřaď větu',
    description: 'Sestav větu ze zamíchaných slov',
    icon: 'ti-reorder',
    requiresAudio: false,
    requiresSentences: true,
  },
  sent_translation: {
    type: 'sent_translation',
    label: 'Přeložit větu',
    description: 'Přelož celou větu',
    icon: 'ti-arrows-exchange',
    requiresAudio: false,
    requiresSentences: true,
  },
  listen_multiple_choice: {
    type: 'listen_multiple_choice',
    label: 'Poslechni a vyber',
    description: 'Poslechni a vyber správnou odpověď',
    icon: 'ti-headphones',
    requiresAudio: true,
    requiresSentences: false,
  },
  listen_write: {
    type: 'listen_write',
    label: 'Poslechni a napiš',
    description: 'Poslechni a napiš co slyšíš',
    icon: 'ti-microphone',
    requiresAudio: true,
    requiresSentences: false,
  },
};

export interface PracticeTypeConfig {
  type: PracticeType;
  isEnabled: boolean;
  isAvailable: boolean;
  unavailableReason: string | null;
}

export interface LessonPracticeConfig {
  lessonId: string;
  isPracticeEnabled: boolean;
  types: PracticeTypeConfig[];
  wordCount: number;
  wordsWithAudio: number;
  wordsWithSentences: number;
  lastGeneratedAt: string | null;
}
