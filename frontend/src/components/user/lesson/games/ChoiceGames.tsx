'use client';

/**
 * Interactive players of choice games: multiple choice and listening.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { GamePlayerProps } from './game-player.types';
import { MultipleChoiceData, MCQuestion, MCOption } from '@/components/admin/mix-editor/games/multiple-choice/multiple-choice.types';
import { ListeningData, ListeningQuestion } from '@/components/admin/mix-editor/games/listening/listening.types';

function optionState(checked: boolean, selected: boolean, correct: boolean): string {
  let cls = 'game-option';
  if (selected) cls += ' game-option--selected';
  if (checked) {
    if (correct) cls += ' game-option--correct';
    else if (selected) cls += ' game-option--wrong';
  }
  return cls;
}

function evalQuestion(options: MCOption[], selected: string[]): boolean {
  const correctIds = options.filter((o) => o.isCorrect).map((o) => o.id).sort();
  const sel = [...selected].sort();
  return correctIds.length === sel.length && correctIds.every((id, i) => id === sel[i]);
}

interface OptionListProps {
  questionId: string;
  options: MCOption[];
  selected: string[];
  multiple: boolean;
  checked: boolean;
  onToggle: (qid: string, oid: string, multiple: boolean) => void;
}

function OptionList({ questionId, options, selected, multiple, checked, onToggle }: OptionListProps) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const isSel = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            disabled={checked}
            onClick={() => onToggle(questionId, o.id, multiple)}
            className={optionState(checked, isSel, o.isCorrect)}
          >
            <i className={`ti ${multiple ? (isSel ? 'ti-square-check' : 'ti-square') : (isSel ? 'ti-circle-check-filled' : 'ti-circle')} text-[16px]`} />
            <span>{o.text || '—'}</span>
          </button>
        );
      })}
    </div>
  );
}

function useChoiceState(questions: { id: string; options: MCOption[] }[], onScoreChange: GamePlayerProps['onScoreChange']) {
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const toggle = (qid: string, oid: string, multiple: boolean) => {
    setSelected((prev) => {
      const cur = prev[qid] ?? [];
      if (multiple) {
        return { ...prev, [qid]: cur.includes(oid) ? cur.filter((x) => x !== oid) : [...cur, oid] };
      }
      return { ...prev, [qid]: [oid] };
    });
  };

  const results = useMemo(
    () => questions.map((q) => evalQuestion(q.options, selected[q.id] ?? [])),
    [questions, selected],
  );
  useEffect(() => {
    onScoreChange({ score: results.filter(Boolean).length, total: questions.length });
  }, [results, questions.length, onScoreChange]);

  return { selected, toggle };
}

export function MultipleChoicePlayer({ data, checked, onScoreChange }: GamePlayerProps<MultipleChoiceData>) {
  const { selected, toggle } = useChoiceState(data.questions, onScoreChange);

  return (
    <div className="flex flex-col gap-admin-lg">
      {data.questions.map((q: MCQuestion) => {
        const multiple = q.options.filter((o) => o.isCorrect).length > 1;
        return (
          <div key={q.id} className="flex flex-col gap-admin-sm">
            {q.imageUrl && (

              <img src={q.imageUrl} alt="" className="max-h-40 rounded-admin-md object-contain self-start" />
            )}
            <p className="text-admin-base font-semibold text-admin-text">{q.question || '—'}</p>
            <OptionList questionId={q.id} options={q.options} selected={selected[q.id] ?? []} multiple={multiple} checked={checked} onToggle={toggle} />
          </div>
        );
      })}
    </div>
  );
}

function AudioPlayer({ url, maxPlays }: { url: string; maxPlays: number }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [plays, setPlays] = useState(0);
  const limited = maxPlays > 0;
  const exhausted = limited && plays >= maxPlays;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={!url || exhausted}
        onClick={() => { ref.current?.play(); setPlays((p) => p + 1); }}
        className="admin-btn admin-btn--ghost admin-btn--md"
      >
        <i className="ti ti-volume text-[18px]" /> Přehrát
      </button>
      {limited && (
        <span className="text-admin-xs text-admin-text-muted">
          {Math.max(0, maxPlays - plays)} z {maxPlays} přehrání
        </span>
      )}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={ref} src={url} preload="auto" />
    </div>
  );
}

export function ListeningPlayer({ data, checked, onScoreChange }: GamePlayerProps<ListeningData>) {
  const { selected, toggle } = useChoiceState(data.questions, onScoreChange);

  return (
    <div className="flex flex-col gap-admin-lg">
      {data.questions.map((q: ListeningQuestion) => {
        const multiple = q.options.filter((o) => o.isCorrect).length > 1;
        return (
          <div key={q.id} className="flex flex-col gap-admin-sm">
            <AudioPlayer url={q.audioUrl} maxPlays={data.playCount} />
            {q.question && <p className="text-admin-base font-semibold text-admin-text">{q.question}</p>}
            <OptionList questionId={q.id} options={q.options} selected={selected[q.id] ?? []} multiple={multiple} checked={checked} onToggle={toggle} />
          </div>
        );
      })}
    </div>
  );
}
