'use client';

/**
 * Duolingo-style game mix player: one game on screen, an animated transition to the next after evaluation and a final summary.
 */

import { useCallback, useMemo, useState } from 'react';
import { SequenceGame, GameType } from '@/lib/mix-editor/mix-editor.types';
import { GameScore } from './games/game-player.types';
import { GAME_PLAYER_REGISTRY } from './games/registry';
import { shuffle } from './games/game-player.types';

interface Props {
  blockId: string;
  games: SequenceGame[];
  isRandomOrder: boolean;
  xp: number;
  previousResult: { score: number; total: number; xpEarned: number } | null;
  onSubmit: (payload: { score: number; total: number; xp: number }) => void;
}

function resolveVariantData(game: SequenceGame): unknown {
  const active = game.variants.find((v) => v.id === game.activeVariantId) ?? game.variants[0];
  return active?.data ?? null;
}

export function MixPlayer({ games, isRandomOrder, xp, previousResult, onSubmit }: Props) {
  const ordered = useMemo(() => {
    const valid = games.filter((g) => resolveVariantData(g) != null);
    return isRandomOrder ? shuffle(valid) : [...valid].sort((a, b) => a.order - b.order);
  }, [games, isRandomOrder]);

  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState(false);
  const [scores, setScores] = useState<Record<string, GameScore>>({});
  const [anim, setAnim] = useState<'in' | 'out'>('in');
  const [done, setDone] = useState(false);

  const current = ordered[step];

  const handleScore = useCallback(
    (gameId: string) => (s: GameScore) =>
      setScores((prev) => {
        const cur = prev[gameId];
        if (cur && cur.score === s.score && cur.total === s.total) return prev;
        return { ...prev, [gameId]: s };
      }),
    [],
  );

  const totals = useMemo(() => {
    let score = 0, total = 0;
    for (const g of ordered) {
      const s = scores[g.id];
      if (s) { score += s.score; total += s.total; }
    }
    return { score, total };
  }, [scores, ordered]);

  const earnedXp = totals.total > 0 ? Math.round((xp * totals.score) / totals.total) : 0;

  function finish() {
    setDone(true);
    onSubmit({ score: totals.score, total: totals.total, xp: earnedXp });
  }

  function handleAdvance() {
    if (!checked) { setChecked(true); return; }
    if (step + 1 >= ordered.length) { finish(); return; }

    setAnim('out');
    setTimeout(() => {
      setStep((s) => s + 1);
      setChecked(false);
      setAnim('in');
    }, 170);
  }

  function restart() {
    setScores({});
    setStep(0);
    setChecked(false);
    setDone(false);
    setAnim('in');
  }

  if (ordered.length === 0) {
    return <p className="text-admin-sm text-admin-text-muted">Mix zatím neobsahuje žádné hry.</p>;
  }

  if (done) {
    const pct = totals.total > 0 ? Math.round((totals.score / totals.total) * 100) : 0;
    return (
      <div className="admin-scale-in text-center py-admin-lg">
        <div className="xp-pop w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-admin-md shadow-admin-glow" style={{ backgroundImage: 'var(--gradient-brand)' }}>
          <i className={`ti ${pct >= 80 ? 'ti-trophy' : pct >= 50 ? 'ti-thumb-up' : 'ti-mood-smile'} text-white text-[32px]`} />
        </div>
        <h3 className="text-admin-lg font-extrabold text-admin-text">Mix dokončen!</h3>
        <p className="text-admin-2xl font-extrabold mt-admin-sm" style={{ color: 'var(--color-block-mix-primary)' }}>{totals.score}/{totals.total}</p>
        <p className="text-admin-sm text-admin-text-muted">{pct}% správně{earnedXp > 0 ? ` · +${earnedXp} XP` : ''}</p>
        <button onClick={restart} className="admin-btn admin-btn--ghost admin-btn--md mt-admin-lg">
          <i className="ti ti-refresh" /> Zkusit znovu
        </button>
      </div>
    );
  }

  const meta = GAME_PLAYER_REGISTRY[current.type as GameType];
  const Player = meta?.Player;
  const data = resolveVariantData(current);

  return (
    <div>

      <div className="flex items-center gap-admin-md mb-admin-lg">
        <div className="flex-1 h-2 rounded-full bg-admin-surface-2 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${(step / ordered.length) * 100}%`, background: 'var(--color-block-mix-primary)' }} />
        </div>
        <span className="text-admin-sm text-admin-text-muted font-semibold tabular-nums">{step + 1}/{ordered.length}</span>
      </div>

      <div key={step} className={anim === 'in' ? 'mix-stage--in' : 'mix-stage--out'}>
        {meta && Player && (
          <div className="flex flex-col gap-admin-sm">
            <div className="flex items-center gap-2">
              <i className={`ti ${meta.icon}`} style={{ color: meta.color }} />
              <span className="text-admin-sm font-bold text-admin-text">{meta.label}</span>
            </div>
            <Player data={data} checked={checked} onScoreChange={handleScore(current.id)} />
          </div>
        )}
      </div>

      <div className="mt-admin-xl pt-admin-lg border-t border-admin-border flex items-center justify-between gap-admin-md">
        <button onClick={handleAdvance} className="admin-btn admin-btn--primary admin-btn--md">
          {!checked ? 'Zkontrolovat' : step + 1 >= ordered.length ? 'Dokončit' : 'Pokračovat'}
          {checked && <i className="ti ti-arrow-right" />}
        </button>

        {checked && scores[current.id] && (
          <span className="flex items-center gap-admin-md text-admin-sm">
            <span className="text-[#2db868] font-semibold">✓ {scores[current.id].score}</span>
            <span className="text-admin-danger font-semibold">✗ {scores[current.id].total - scores[current.id].score}</span>
          </span>
        )}

        {!checked && step === 0 && previousResult && previousResult.total > 0 && (
          <span className="text-admin-xs text-admin-text-muted">Naposledy: {previousResult.score}/{previousResult.total}</span>
        )}
      </div>
    </div>
  );
}
