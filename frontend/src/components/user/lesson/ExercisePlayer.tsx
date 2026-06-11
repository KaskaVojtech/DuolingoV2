'use client';

/**
 * Interactive exercise player: reuses the admin item preview, evaluates answers and reports score and XP.
 */

import { useState } from 'react';
import { ExerciseItem, McComponent } from '@/lib/exercise/exercise.types';
import { PreviewItem } from '@/components/admin/exercise-editor/preview/PreviewItem';
import { checkAnswers, scoreFromResults, EvalResult } from '@/lib/exercise/exercise-evaluation';

interface Props {
  blockId: string;
  instructions: string | null;
  xp: number;
  items: ExerciseItem[];
  previousResult: { score: number; total: number; xpEarned: number } | null;
  onSubmit: (payload: { score: number; total: number; xp: number }) => void;
}

export function ExercisePlayer({ instructions, xp, items, previousResult, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mcSelected, setMcSelected] = useState<Record<string, string[]>>({});
  const [hlSelected, setHlSelected] = useState<Record<string, string[]>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, EvalResult>>({});

  const handleAnswer = (nodeId: string, value: string) => {
    setAnswers((p) => ({ ...p, [nodeId]: value }));
    setChecked(false);
  };

  const handleMcToggle = (itemId: string, optionId: string) => {
    const item = items.find((i) => i.id === itemId) as McComponent | undefined;
    if (!item) return;
    setMcSelected((prev) => {
      const cur = prev[itemId] ?? [];
      if (item.multiple) {
        return { ...prev, [itemId]: cur.includes(optionId) ? cur.filter((id) => id !== optionId) : [...cur, optionId] };
      }
      return { ...prev, [itemId]: [optionId] };
    });
    setChecked(false);
  };

  const handleHlToggle = (itemId: string, word: string) => {
    setHlSelected((prev) => {
      const cur = prev[itemId] ?? [];
      return { ...prev, [itemId]: cur.includes(word) ? cur.filter((w) => w !== word) : [...cur, word] };
    });
    setChecked(false);
  };

  const handleCheck = () => {
    const res = checkAnswers(items, answers, mcSelected, hlSelected);
    setResults(res);
    setChecked(true);
    const { score, total } = scoreFromResults(res);
    const earnedXp = total > 0 ? Math.round((xp * score) / total) : 0;
    onSubmit({ score, total, xp: earnedXp });
  };

  const { score, total, teacher } = checked
    ? scoreFromResults(results)
    : { score: 0, total: 0, teacher: 0 };
  const allCorrect = checked && total > 0 && score === total;

  return (
    <div className="exercise-player">
      {instructions && (
        <p className="text-admin-sm text-admin-text-muted mb-admin-lg">{instructions}</p>
      )}

      <div className="flex flex-col gap-admin-lg">
        {items.map((item) => (
          <div key={item.id}>
            <PreviewItem
              item={item}
              answers={answers}
              mcSelected={mcSelected}
              hlSelected={hlSelected}
              onAnswer={handleAnswer}
              onMcToggle={handleMcToggle}
              onHlToggle={handleHlToggle}
              checked={checked}
              results={results}
            />
          </div>
        ))}
      </div>

      <div className="mt-admin-xl pt-admin-lg border-t border-admin-border flex items-center justify-between gap-admin-md flex-wrap">
        <button
          onClick={handleCheck}
          className="admin-btn admin-btn--primary admin-btn--md"
        >
          Zkontrolovat odpovědi
        </button>

        {checked && (
          <div className="flex items-center gap-admin-md text-admin-sm">
            <span className="text-[#2db868] font-semibold">✓ {score}</span>
            <span className="text-admin-danger font-semibold">✗ {total - score}</span>
            {teacher > 0 && <span className="text-admin-text-muted">⏳ {teacher} čeká na učitele</span>}
            {allCorrect && (
              <span className="xp-pop flex items-center gap-1 text-[#2db868] font-bold">
                <i className="ti ti-confetti" /> +{xp} XP
              </span>
            )}
          </div>
        )}

        {!checked && previousResult && previousResult.total > 0 && (
          <span className="text-admin-xs text-admin-text-muted">
            Naposledy: {previousResult.score}/{previousResult.total}
            {previousResult.xpEarned > 0 && ` · ${previousResult.xpEarned} XP`}
          </span>
        )}
      </div>
    </div>
  );
}
