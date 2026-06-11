/**
 * Generates practice questions and pairs from a lesson's vocabulary and assesses availability of individual types.
 */
import { PracticeType, UserVocabWord } from '@/lib/user-auth/user-lesson.api';
import { PracticeQuestion, MemoryPair } from './practice.types';

const MAX_QUESTIONS = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distractors(words: UserVocabWord[], exclude: UserVocabWord, pick: (w: UserVocabWord) => string, n: number): string[] {
  const pool = shuffle(words.filter((w) => w.id !== exclude.id).map(pick).filter(Boolean));
  return Array.from(new Set(pool)).slice(0, n);
}

const withAudio = (w: UserVocabWord[]) => w.filter((x) => !!x.pronunciationUrl);
const withSentence = (w: UserVocabWord[]) => w.filter((x) => !!x.exampleSentence && x.exampleSentence.trim().split(/\s+/).length >= 3);

export function isTypeAvailable(type: PracticeType, words: UserVocabWord[]): boolean {
  switch (type) {
    case 'vocab_multiple_choice':
    case 'listen_multiple_choice':
      return words.length >= 4 && (type === 'vocab_multiple_choice' || withAudio(words).length >= 1);
    case 'vocab_translation':
      return words.length >= 1;
    case 'vocab_memory':
    case 'vocab_drag':
      return words.length >= 3;
    case 'vocab_spelling':
    case 'listen_write':
      return withAudio(words).length >= 1;
    case 'sent_fill_in':
    case 'sent_word_order':
      return withSentence(words).length >= 1;
    case 'sent_translation':
      return false;
    default:
      return false;
  }
}

export function generateQuestions(type: PracticeType, words: UserVocabWord[]): PracticeQuestion[] {
  const ws = shuffle(words);

  switch (type) {
    case 'vocab_multiple_choice':
      return ws.slice(0, MAX_QUESTIONS).map((w) => ({
        kind: 'choice' as const,
        id: w.id,
        prompt: w.wordEn,
        options: shuffle([w.wordCs, ...distractors(words, w, (x) => x.wordCs, 3)]),
        correct: w.wordCs,
      }));

    case 'vocab_translation':
      return ws.slice(0, MAX_QUESTIONS).map((w) => ({
        kind: 'input' as const,
        id: w.id,
        prompt: w.wordEn,
        accept: [w.wordCs],
        showPrompt: true,
      }));

    case 'vocab_spelling':
    case 'listen_write':
      return shuffle(withAudio(words)).slice(0, MAX_QUESTIONS).map((w) => ({
        kind: 'input' as const,
        id: w.id,
        prompt: w.wordEn,
        audioUrl: w.pronunciationUrl!,
        accept: [w.wordEn],
        showPrompt: false,
      }));

    case 'listen_multiple_choice':
      return shuffle(withAudio(words)).slice(0, MAX_QUESTIONS).map((w) => ({
        kind: 'choice' as const,
        id: w.id,
        prompt: 'Které slovo jsi slyšel/a?',
        audioUrl: w.pronunciationUrl!,
        options: shuffle([w.wordEn, ...distractors(words, w, (x) => x.wordEn, 3)]),
        correct: w.wordEn,
      }));

    case 'sent_word_order':
      return shuffle(withSentence(words)).slice(0, MAX_QUESTIONS).map((w) => ({
        kind: 'order' as const,
        id: w.id,
        prompt: 'Seřaď slova do správného pořadí',
        words: w.exampleSentence!.trim().replace(/\s+/g, ' ').split(' '),
      }));

    case 'sent_fill_in':
      return shuffle(withSentence(words)).slice(0, MAX_QUESTIONS).map((w) => {
        const sentence = w.exampleSentence!.trim();

        const re = new RegExp(`\\b${w.wordEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        let answer = w.wordEn;
        let idx = sentence.search(re);
        if (idx < 0) {
          const tokens = sentence.split(' ');
          const longest = tokens.reduce((a, b) => (b.length > a.length ? b : a), '');
          answer = longest.replace(/[^\p{L}]/gu, '');
          idx = sentence.indexOf(longest);
        }
        const matched = sentence.slice(idx).match(re)?.[0] ?? answer;
        return {
          kind: 'fill' as const,
          id: w.id,
          prompt: 'Doplň chybějící slovo',
          before: sentence.slice(0, idx),
          after: sentence.slice(idx + matched.length),
          accept: [answer],
        };
      });

    default:
      return [];
  }
}

export function generatePairs(words: UserVocabWord[]): MemoryPair[] {
  return shuffle(words).slice(0, 8).map((w) => ({ id: w.id, en: w.wordEn, cs: w.wordCs }));
}
