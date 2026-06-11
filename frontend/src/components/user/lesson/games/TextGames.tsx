'use client';

/**
 * Interactive players of text games: fill-in, word transform and translation.
 */

import { useEffect, useState, useMemo } from 'react';
import { GamePlayerProps, matchesAny } from './game-player.types';
import { FillInData } from '@/components/admin/mix-editor/games/fill-in/fill-in.types';
import { WordTransformData } from '@/components/admin/mix-editor/games/word-transform/word-transform.types';
import { TranslationData } from '@/components/admin/mix-editor/games/translation/translation.types';

function feedbackClass(checked: boolean, ok: boolean): string {
  if (!checked) return 'admin-field';
  return `admin-field ${ok ? 'game-answer--correct' : 'game-answer--wrong'}`;
}

export function FillInPlayer({ data, checked, onScoreChange }: GamePlayerProps<FillInData>) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const results = useMemo(
    () => data.sentences.map((s) => matchesAny(answers[s.id] ?? '', s.answer)),
    [answers, data.sentences],
  );
  useEffect(() => {
    onScoreChange({ score: results.filter(Boolean).length, total: data.sentences.length });
  }, [results, data.sentences.length, onScoreChange]);

  return (
    <div className="flex flex-col gap-admin-md">
      {data.sentences.map((s, i) => {
        const [before, after] = (s.sentence || '{blank}').split('{blank}');
        return (
          <div key={s.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap text-admin-base text-admin-text">
              <span>{before}</span>
              <input
                value={answers[s.id] ?? ''}
                onChange={(e) => setAnswers((p) => ({ ...p, [s.id]: e.target.value }))}
                disabled={checked}
                placeholder="…"
                className={`${feedbackClass(checked, results[i])} !w-32 inline-block text-center`}
              />
              <span>{after}</span>
            </div>
            {data.showHints && s.hint && !checked && (
              <span className="text-admin-xs text-admin-text-muted">💡 {s.hint}</span>
            )}
            {checked && !results[i] && (
              <span className="text-admin-xs text-[#2db868]">Správně: {s.answer}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function WordTransformPlayer({ data, checked, onScoreChange }: GamePlayerProps<WordTransformData>) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const results = useMemo(
    () => data.items.map((it) => matchesAny(answers[it.id] ?? '', it.answer, it.acceptAlso)),
    [answers, data.items],
  );
  useEffect(() => {
    onScoreChange({ score: results.filter(Boolean).length, total: data.items.length });
  }, [results, data.items.length, onScoreChange]);

  return (
    <div className="flex flex-col gap-admin-lg">
      {data.items.map((it, i) => {
        const [before, after] = (it.sentence || '{word}').split('{word}');
        return (
          <div key={it.id} className="flex flex-col gap-1">
            {it.instruction && <span className="text-admin-xs text-admin-text-muted">{it.instruction}</span>}
            <div className="flex items-center gap-2 flex-wrap text-admin-base text-admin-text">
              <span>{before}</span>
              <input
                value={answers[it.id] ?? ''}
                onChange={(e) => setAnswers((p) => ({ ...p, [it.id]: e.target.value }))}
                disabled={checked}
                placeholder={it.baseWord}
                className={`${feedbackClass(checked, results[i])} !w-40 inline-block text-center`}
              />
              <span>{after}</span>
              <span className="text-admin-xs text-admin-text-muted">({it.baseWord})</span>
            </div>
            {checked && !results[i] && (
              <span className="text-admin-xs text-[#2db868]">Správně: {it.answer}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TranslationPlayer({ data, checked, onScoreChange }: GamePlayerProps<TranslationData>) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const results = useMemo(
    () => data.items.map((it) => matchesAny(answers[it.id] ?? '', it.answer, it.acceptAlso)),
    [answers, data.items],
  );
  useEffect(() => {
    onScoreChange({ score: results.filter(Boolean).length, total: data.items.length });
  }, [results, data.items.length, onScoreChange]);

  return (
    <div className="flex flex-col gap-admin-md">
      {data.items.map((it, i) => (
        <div key={it.id} className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-admin-xs text-admin-text-muted">
            <i className="ti ti-arrow-right" />
            {it.direction === 'en_to_cs' ? 'EN → CS' : 'CS → EN'}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-admin-base font-semibold text-admin-text">{it.source}</span>
            <input
              value={answers[it.id] ?? ''}
              onChange={(e) => setAnswers((p) => ({ ...p, [it.id]: e.target.value }))}
              disabled={checked}
              placeholder="překlad…"
              className={`${feedbackClass(checked, results[i])} !w-56 inline-block`}
            />
          </div>
          {checked && !results[i] && (
            <span className="text-admin-xs text-[#2db868]">Správně: {it.answer}</span>
          )}
        </div>
      ))}
    </div>
  );
}
