export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'interjection'
  | 'phrase';

export const POS_LABELS: Record<PartOfSpeech, string> = {
  noun:         'Podst. jméno',
  verb:         'Sloveso',
  adjective:    'Příd. jméno',
  adverb:       'Příslovce',
  preposition:  'Předložka',
  conjunction:  'Spojka',
  pronoun:      'Zájmeno',
  interjection: 'Citoslovce',
  phrase:       'Fráze',
};

export interface VocabularyWord {
  id: string;
  wordEn: string;
  wordCs: string;
  pos: PartOfSpeech;
  exampleSentence: string | null;
  imageUrl: string | null;
  pronunciationUrl: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LessonVocabularyEntry {
  id: string;
  word: VocabularyWord;
  lessonId: string;
  addedAt: string;
  importedFromLessonId: string | null;
  importedFromLessonTitle: string | null;
}

export interface VocabularyFilter {
  searchQuery: string;
  pos: PartOfSpeech | null;
  importedOnly: boolean;
  sortField: 'wordEn' | 'wordCs' | 'pos' | 'addedAt';
  sortDirection: 'asc' | 'desc';
}

export interface LessonForImport {
  id: string;
  title: string;
  courseTitle: string;
  wordCount: number;
}
