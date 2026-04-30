import { Vocabulary } from '@/lib/types/lesson.types';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, Math.min(count, arr.length));
}

export type GameType = 'matching' | 'fillin' | 'write' | 'flashcards';

export interface GameMeta {
  id: GameType;
  title: string;
  description: string;
  icon: string;
  minWords: number;
  color: 'pink' | 'blue';
}

export const GAMES: GameMeta[] = [
  {
    id: 'flashcards',
    title: 'Flash Cards',
    description: 'Prohlédni si slovíčka a otočením karty si ověř znalost',
    icon: '🃏',
    minWords: 1,
    color: 'blue',
  },
  {
    id: 'matching',
    title: 'Spojovačka',
    description: 'Spoj česká slovíčka s jejich anglickými překlady',
    icon: '🔗',
    minWords: 3,
    color: 'pink',
  },
  {
    id: 'fillin',
    title: 'Doplňovačka',
    description: 'Vyber správný překlad ze čtyř možností',
    icon: '☑️',
    minWords: 4,
    color: 'blue',
  },
  {
    id: 'write',
    title: 'Dopisovačka',
    description: 'Napiš anglický překlad zobrazeného českého slovíčka',
    icon: '✏️',
    minWords: 1,
    color: 'pink',
  },
];

export function canPlayGame(game: GameMeta, words: Vocabulary[]): boolean {
  return words.length >= game.minWords;
}

export interface GameResult {
  correct: number;
  total: number;
}
