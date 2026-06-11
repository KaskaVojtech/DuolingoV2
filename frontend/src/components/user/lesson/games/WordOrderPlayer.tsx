'use client';

/**
 * Interactive player of the word-ordering game.
 */

import { useEffect, useMemo, useState } from 'react';
import { GamePlayerProps, shuffle } from './game-player.types';
import { WordOrderData, WordOrderSentence } from '@/components/admin/mix-editor/games/word-order/word-order.types';

function SentenceRow({
  sentence,
  checked,
  showHint,
  onResult,
}: {
  sentence: WordOrderSentence;
  checked: boolean;
  showHint: boolean;
  onResult: (ok: boolean) => void;
}) {

  const bank = useMemo(
    () => shuffle(sentence.words.map((w, i) => ({ w, key: `${i}` }))),
    [sentence.words],
  );
  const [picked, setPicked] = useState<{ w: string; key: string }[]>([]);

  const remaining = bank.filter((b) => !picked.some((p) => p.key === b.key));
  const assembled = picked.map((p) => p.w);
  const ok = assembled.length === sentence.words.length && assembled.every((w, i) => w === sentence.words[i]);

  useEffect(() => { onResult(ok); }, [ok, onResult]);

  return (
    <div className="flex flex-col gap-2">

      <div className={`flex items-center gap-2 flex-wrap min-h-[44px] p-2 rounded-admin-sm border ${
        checked ? (ok ? 'game-answer--correct' : 'game-answer--wrong') : 'border-admin-border bg-admin-surface-2'
      }`}>
        {picked.length === 0 && <span className="text-admin-xs text-admin-text-muted">Klikni na slova ve správném pořadí…</span>}
        {picked.map((p) => (
          <button
            key={p.key}
            type="button"
            disabled={checked}
            onClick={() => setPicked((prev) => prev.filter((x) => x.key !== p.key))}
            className="game-chip game-chip--picked"
          >
            {p.w}
          </button>
        ))}
      </div>

      {!checked && (
        <div className="flex items-center gap-2 flex-wrap">
          {remaining.map((b) => (
            <button key={b.key} type="button" onClick={() => setPicked((prev) => [...prev, b])} className="game-chip">
              {b.w}
            </button>
          ))}
        </div>
      )}
      {showHint && sentence.hint && !checked && (
        <span className="text-admin-xs text-admin-text-muted">💡 {sentence.hint}</span>
      )}
      {checked && !ok && (
        <span className="text-admin-xs text-[#2db868]">Správně: {sentence.words.join(' ')}</span>
      )}
    </div>
  );
}

export function WordOrderPlayer({ data, checked, onScoreChange }: GamePlayerProps<WordOrderData>) {
  const [results, setResults] = useState<Record<string, boolean>>({});

  const setOne = useMemo(
    () => (id: string) => (ok: boolean) =>
      setResults((prev) => (prev[id] === ok ? prev : { ...prev, [id]: ok })),
    [],
  );

  useEffect(() => {
    const score = data.sentences.filter((s) => results[s.id]).length;
    onScoreChange({ score, total: data.sentences.length });
  }, [results, data.sentences, onScoreChange]);

  return (
    <div className="flex flex-col gap-admin-lg">
      {data.sentences.map((s) => (
        <SentenceRow key={s.id} sentence={s} checked={checked} showHint={data.showHint} onResult={setOne(s.id)} />
      ))}
    </div>
  );
}
