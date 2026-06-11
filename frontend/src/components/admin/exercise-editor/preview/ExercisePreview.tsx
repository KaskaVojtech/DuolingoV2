'use client';

import { useState } from 'react';
import { useExerciseStore } from '@/lib/exercise/exercise.store';
import { ExerciseItem, InlineContent, McComponent, HighlightComponent, DragAndDropComponent, InputComponent, SelectComponent, SelectBetweenComponent, DragTargetComponent, TableCell } from '@/lib/exercise/exercise.types';
import { PreviewItem } from './PreviewItem';
import { AdminButton } from '@/components/admin/common/AdminButton';

function collectNodeIds(item: ExerciseItem): string[] {
  if (item.type === 'inline') {
    return (item as InlineContent).nodes
      .filter((n) => n.type !== 'text')
      .map((n) => (n as { id: string }).id);
  }
  if (item.type === 'table') {
    return item.rows.flatMap((row) =>
      row.flatMap((cell: TableCell) => {
        if (cell.type === 'static') return [];
        return [(cell.component as InputComponent | SelectComponent | SelectBetweenComponent).id];
      })
    );
  }
  if (item.type === 'drag_and_drop') {
    return (item as DragAndDropComponent).targets.map((t: DragTargetComponent) => t.id);
  }
  if (item.type === 'answer') return [item.id];
  return [];
}

function checkAnswers(items: ExerciseItem[], answers: Record<string, string>, mcSelected: Record<string, string[]>, hlSelected: Record<string, string[]>): Record<string, boolean | 'teacher'> {
  const results: Record<string, boolean | 'teacher'> = {};

  for (const item of items) {
    if (item.type === 'inline') {
      for (const node of (item as InlineContent).nodes) {
        if (node.type === 'text') continue;
        const n = node as InputComponent | SelectComponent | SelectBetweenComponent | DragTargetComponent;
        if (n.type === 'input') {
          if ((n as InputComponent).evaluation === 'teacher') {
            results[n.id] = 'teacher';
          } else {
            const val = (answers[n.id] ?? '').trim().toLowerCase();
            const correct = (n as InputComponent).correct.trim().toLowerCase();
            const acceptAlso = ((n as InputComponent).acceptAlso ?? []).map((a) => a.trim().toLowerCase());
            results[n.id] = val === correct || acceptAlso.includes(val);
          }
        } else if (n.type === 'select' || n.type === 'select_between') {
          results[n.id] = answers[n.id] === (n as SelectComponent).correct;
        } else if (n.type === 'drag_target') {
          results[n.id] = answers[n.id] === (n as DragTargetComponent).correct;
        }
      }
    } else if (item.type === 'mc') {
      const mc = item as McComponent;
      const sel = mcSelected[mc.id] ?? [];
      mc.options.forEach((opt) => {
        results[opt.id] = (opt.correct === sel.includes(opt.id));
      });
    } else if (item.type === 'answer') {
      results[item.id] = item.evaluation === 'teacher' ? 'teacher' : true;
    } else if (item.type === 'drag_and_drop') {
      (item as DragAndDropComponent).targets.forEach((t) => {
        results[t.id] = answers[t.id] === t.correct;
      });
    }
  }
  return results;
}

export function ExercisePreview() {
  const { exercise } = useExerciseStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mcSelected, setMcSelected] = useState<Record<string, string[]>>({});
  const [hlSelected, setHlSelected] = useState<Record<string, string[]>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, boolean | 'teacher'>>({});

  const handleAnswer = (nodeId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [nodeId]: value }));
    setChecked(false);
  };

  const handleMcToggle = (itemId: string, optionId: string) => {
    const item = exercise.items.find((i) => i.id === itemId) as McComponent | undefined;
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
    setResults(checkAnswers(exercise.items, answers, mcSelected, hlSelected));
    setChecked(true);
  };

  const teacherCount = Object.values(results).filter((v) => v === 'teacher').length;
  const correctCount = Object.values(results).filter((v) => v === true).length;
  const wrongCount = Object.values(results).filter((v) => v === false).length;

  return (
    <div className="exercise-preview max-w-2xl mx-auto">
      {exercise.instructions && (
        <p className="text-admin-sm text-admin-text-muted mb-admin-lg">{exercise.instructions}</p>
      )}

      <div className="flex flex-col gap-admin-lg">
        {exercise.items.map((item) => (
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

      <div className="mt-admin-xl pt-admin-lg border-t border-admin-border flex items-center justify-between">
        <AdminButton variant="primary" onClick={handleCheck}>
          Zkontrolovat odpovědi
        </AdminButton>
        {checked && (
          <div className="flex gap-admin-md text-admin-sm">
            <span className="text-[#2db868]">✓ {correctCount}</span>
            <span className="text-admin-danger">✗ {wrongCount}</span>
            {teacherCount > 0 && <span className="text-admin-text-muted">⏳ {teacherCount} čeká na učitele</span>}
          </div>
        )}
      </div>
    </div>
  );
}
