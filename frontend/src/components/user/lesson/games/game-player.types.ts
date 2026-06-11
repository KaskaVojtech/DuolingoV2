/**
 * Shared types and helpers of the game players (score, answer normalization, shuffle).
 */
export interface GameScore {
  score: number;
  total: number;
}

export interface GamePlayerProps<T = unknown> {
  data: T;
  checked: boolean;
  onScoreChange: (s: GameScore) => void;
}

export function norm(s: string): string {
  return (s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function matchesAny(value: string, answer: string, acceptAlso: string[] = []): boolean {
  const v = norm(value);
  if (!v) return false;
  return v === norm(answer) || acceptAlso.map(norm).includes(v);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
