'use client';

/**
 * Board practice games: memory and pair matching.
 */

import { useMemo, useState } from 'react';
import { MemoryPair } from '@/lib/user-practice/practice.types';
import { shuffle } from '@/components/user/lesson/games/game-player.types';

interface BoardProps {
  pairs: MemoryPair[];
  label: string;
  color: string;
  onExit: () => void;
}

function ResultScreen({ color, label, moves, onExit }: { color: string; label: string; moves: number; onExit: () => void }) {
  return (
    <div className="admin-card admin-scale-in p-admin-2xl text-center max-w-md mx-auto">
      <div className="xp-pop w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-admin-md shadow-admin-md" style={{ background: color }}>
        <i className="ti ti-trophy text-white text-[32px]" />
      </div>
      <h2 className="text-admin-xl font-extrabold text-admin-text">Hotovo!</h2>
      <p className="text-admin-base text-admin-text-muted mt-1">{label}</p>
      <p className="text-admin-sm text-admin-text-muted mt-admin-md">Počet tahů: <strong>{moves}</strong></p>
      <button onClick={onExit} className="admin-btn admin-btn--primary admin-btn--md mt-admin-lg">
        <i className="ti ti-arrow-left" /> Zpět na procvičování
      </button>
    </div>
  );
}

interface Card { uid: string; pairId: string; text: string; }

export function MemoryGame({ pairs, label, color, onExit }: BoardProps) {
  const cards = useMemo<Card[]>(
    () => shuffle(pairs.flatMap((p) => [
      { uid: `${p.id}-en`, pairId: p.id, text: p.en },
      { uid: `${p.id}-cs`, pairId: p.id, text: p.cs },
    ])),
    [pairs],
  );

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);

  const done = matched.length === cards.length;

  function flip(uid: string) {
    if (busy || flipped.includes(uid) || matched.includes(uid)) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((u) => cards.find((c) => c.uid === u)!);
      if (a.pairId === b.pairId) {
        setMatched((m) => [...m, a.uid, b.uid]);
        setFlipped([]);
      } else {
        setBusy(true);
        setTimeout(() => { setFlipped([]); setBusy(false); }, 800);
      }
    }
  }

  if (done) return <ResultScreen color={color} label={label} moves={moves} onExit={onExit} />;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-admin-lg">
        <button onClick={onExit} className="text-admin-text-muted hover:text-admin-text" title="Ukončit"><i className="ti ti-x text-[20px]" /></button>
        <span className="text-admin-sm text-admin-text-muted">Tahy: {moves}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-admin-sm">
        {cards.map((c) => {
          const isUp = flipped.includes(c.uid) || matched.includes(c.uid);
          const isMatched = matched.includes(c.uid);
          return (
            <button
              key={c.uid}
              type="button"
              onClick={() => flip(c.uid)}
              className={`memory-card aspect-[3/4] ${isUp ? 'memory-card--up' : ''} ${isMatched ? 'memory-card--matched' : ''}`}
            >
              <span className="memory-card__inner">
                <span className="memory-card__face memory-card__face--front">
                  <i className="ti ti-question-mark text-admin-text-muted text-[20px]" />
                </span>
                <span className="memory-card__face memory-card__face--back">{c.text}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MatchGame({ pairs, label, color, onExit }: BoardProps) {
  const lefts = useMemo(() => shuffle(pairs), [pairs]);
  const rights = useMemo(() => shuffle(pairs), [pairs]);

  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);

  const done = matched.length === pairs.length;

  function pickRight(pairId: string) {
    if (!selLeft || matched.includes(pairId)) return;
    setMoves((m) => m + 1);
    if (selLeft === pairId) {
      setMatched((m) => [...m, pairId]);
      setSelLeft(null);
    } else {
      setWrong(pairId);
      setTimeout(() => setWrong(null), 500);
    }
  }

  if (done) return <ResultScreen color={color} label={label} moves={moves} onExit={onExit} />;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-admin-lg">
        <button onClick={onExit} className="text-admin-text-muted hover:text-admin-text" title="Ukončit"><i className="ti ti-x text-[20px]" /></button>
        <span className="text-admin-sm text-admin-text-muted">{matched.length}/{pairs.length}</span>
      </div>
      <div className="grid grid-cols-2 gap-admin-lg">
        <div className="flex flex-col gap-2">
          {lefts.map((p) => {
            const isMatched = matched.includes(p.id);
            const isSel = selLeft === p.id;
            return (
              <button
                key={p.id}
                type="button"
                disabled={isMatched}
                onClick={() => setSelLeft(p.id)}
                className={`game-option ${isMatched ? 'game-option--correct opacity-60' : isSel ? 'game-option--selected' : ''}`}
              >
                {p.en}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rights.map((p) => {
            const isMatched = matched.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                disabled={isMatched}
                onClick={() => pickRight(p.id)}
                className={`game-option ${isMatched ? 'game-option--correct opacity-60' : wrong === p.id ? 'game-option--wrong' : ''}`}
              >
                {p.cs}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
