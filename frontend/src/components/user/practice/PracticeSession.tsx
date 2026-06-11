'use client';

/**
 * Sequential practice runner: guides the user through questions one by one with feedback and a final score.
 */

import { useMemo, useRef, useState } from 'react';
import { PracticeQuestion } from '@/lib/user-practice/practice.types';
import { norm, matchesAny, shuffle } from '@/components/user/lesson/games/game-player.types';

function AudioButton({ url }: { url: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  return (
    <div className="flex justify-center my-admin-md">
      <button type="button" onClick={() => ref.current?.play()} className="admin-btn admin-btn--ghost admin-btn--md">
        <i className="ti ti-volume text-[20px]" /> Přehrát
      </button>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={ref} src={url} preload="auto" autoPlay />
    </div>
  );
}

interface Props {
  questions: PracticeQuestion[];
  label: string;
  color: string;
  onExit: () => void;
}

export function PracticeSession({ questions, label, color, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [text, setText] = useState('');
  const [choice, setChoice] = useState<string | null>(null);
  const [order, setOrder] = useState<{ w: string; key: string }[]>([]);

  const q = questions[index];
  const done = index >= questions.length;

  const bank = useMemo(() => {
    if (q?.kind === 'order') return shuffle(q.words.map((w, i) => ({ w, key: `${i}` })));
    return [];
  }, [q]);

  function resetAnswer() {
    setText(''); setChoice(null); setOrder([]); setChecked(false); setIsCorrect(false);
  }

  function evaluate(): boolean {
    if (!q) return false;
    if (q.kind === 'choice') return choice === q.correct;
    if (q.kind === 'input') return matchesAny(text, q.accept[0], q.accept.slice(1));
    if (q.kind === 'fill') return matchesAny(text, q.accept[0], q.accept.slice(1));
    if (q.kind === 'order') {
      const assembled = order.map((o) => o.w);
      return assembled.length === q.words.length && assembled.every((w, i) => norm(w) === norm(q.words[i]));
    }
    return false;
  }

  function handleCheck() {
    const ok = evaluate();
    setIsCorrect(ok);
    setChecked(true);
    if (ok) setCorrectCount((c) => c + 1);
  }

  function handleNext() {
    resetAnswer();
    setIndex((i) => i + 1);
  }

  const canCheck = q?.kind === 'choice' ? choice !== null
    : q?.kind === 'order' ? order.length === q.words.length
    : text.trim().length > 0;

  if (done) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="admin-card admin-scale-in p-admin-2xl text-center max-w-md mx-auto">
        <div className="xp-pop w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-admin-md shadow-admin-md" style={{ background: color }}>
          <i className={`ti ${pct >= 80 ? 'ti-trophy' : pct >= 50 ? 'ti-thumb-up' : 'ti-mood-smile'} text-white text-[32px]`} />
        </div>
        <h2 className="text-admin-xl font-extrabold text-admin-text">Hotovo!</h2>
        <p className="text-admin-base text-admin-text-muted mt-1">{label}</p>
        <p className="text-admin-2xl font-extrabold mt-admin-md" style={{ color }}>{correctCount}/{questions.length}</p>
        <p className="text-admin-sm text-admin-text-muted">{pct}% správně</p>
        <button onClick={onExit} className="admin-btn admin-btn--primary admin-btn--md mt-admin-lg">
          <i className="ti ti-arrow-left" /> Zpět na procvičování
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">

      <div className="flex items-center gap-admin-md mb-admin-lg">
        <button onClick={onExit} className="text-admin-text-muted hover:text-admin-text" title="Ukončit">
          <i className="ti ti-x text-[20px]" />
        </button>
        <div className="flex-1 h-2 rounded-full bg-admin-surface-2 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${(index / questions.length) * 100}%`, background: color }} />
        </div>
        <span className="text-admin-sm text-admin-text-muted font-semibold tabular-nums">{index + 1}/{questions.length}</span>
      </div>

      <div className="admin-card p-admin-xl">
        {'audioUrl' in q && q.audioUrl && <AudioButton key={q.id} url={q.audioUrl} />}

        {(q.kind !== 'input' || q.showPrompt) && (
          <p className="text-admin-lg font-extrabold text-admin-text text-center mb-admin-lg">
            {q.kind === 'fill'
              ? <span>{q.before}<span className="px-2 text-admin-text-muted">_____</span>{q.after}</span>
              : q.prompt}
          </p>
        )}

        {q.kind === 'choice' && (
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => {
              let cls = 'game-option';
              if (choice === opt) cls += ' game-option--selected';
              if (checked) {
                if (opt === q.correct) cls += ' game-option--correct';
                else if (choice === opt) cls += ' game-option--wrong';
              }
              return (
                <button key={opt} type="button" disabled={checked} onClick={() => setChoice(opt)} className={cls}>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {(q.kind === 'input' || q.kind === 'fill') && (
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={checked}
            onKeyDown={(e) => { if (e.key === 'Enter' && canCheck && !checked) handleCheck(); }}
            placeholder="Napiš odpověď…"
            className={`admin-field text-center text-admin-lg ${checked ? (isCorrect ? 'game-answer--correct' : 'game-answer--wrong') : ''}`}
          />
        )}

        {q.kind === 'order' && (
          <div className="flex flex-col gap-admin-md">
            <div className={`flex items-center gap-2 flex-wrap min-h-[48px] p-2 rounded-admin-sm border ${
              checked ? (isCorrect ? 'game-answer--correct' : 'game-answer--wrong') : 'border-admin-border bg-admin-surface-2'
            }`}>
              {order.length === 0 && <span className="text-admin-xs text-admin-text-muted">Klikni na slova…</span>}
              {order.map((o) => (
                <button key={o.key} type="button" disabled={checked} onClick={() => setOrder((p) => p.filter((x) => x.key !== o.key))} className="game-chip game-chip--picked">
                  {o.w}
                </button>
              ))}
            </div>
            {!checked && (
              <div className="flex items-center gap-2 flex-wrap">
                {bank.filter((b) => !order.some((o) => o.key === b.key)).map((b) => (
                  <button key={b.key} type="button" onClick={() => setOrder((p) => [...p, b])} className="game-chip">{b.w}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {checked && !isCorrect && (
          <p className="text-admin-sm text-[#2db868] text-center mt-admin-md">
            Správně: <strong>{q.kind === 'choice' ? q.correct : q.kind === 'order' ? q.words.join(' ') : q.accept[0]}</strong>
          </p>
        )}

        <div className="mt-admin-lg flex justify-center">
          {!checked ? (
            <button onClick={handleCheck} disabled={!canCheck} className="admin-btn admin-btn--primary admin-btn--md">
              Zkontrolovat
            </button>
          ) : (
            <button onClick={handleNext} className="admin-btn admin-btn--primary admin-btn--md">
              {index + 1 >= questions.length ? 'Dokončit' : 'Další'} <i className="ti ti-arrow-right" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
