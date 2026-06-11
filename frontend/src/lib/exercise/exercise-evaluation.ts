/**
 * Evaluates exercise answers (shared by admin and the player): checks item correctness and computes the score.
 */
import {
  ExerciseItem,
  InlineContent,
  McComponent,
  DragAndDropComponent,
  InputComponent,
  SelectComponent,
  SelectBetweenComponent,
  DragTargetComponent,
  TableCell,
} from './exercise.types';

export type EvalResult = boolean | 'teacher';

export function collectNodeIds(item: ExerciseItem): string[] {
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
      }),
    );
  }
  if (item.type === 'drag_and_drop') {
    return (item as DragAndDropComponent).targets.map((t: DragTargetComponent) => t.id);
  }
  if (item.type === 'answer') return [item.id];
  return [];
}

export function checkAnswers(
  items: ExerciseItem[],
  answers: Record<string, string>,
  mcSelected: Record<string, string[]>,
  hlSelected: Record<string, string[]>,
): Record<string, EvalResult> {
  const results: Record<string, EvalResult> = {};

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
        results[opt.id] = opt.correct === sel.includes(opt.id);
      });
    } else if (item.type === 'table') {
      for (const row of item.rows) {
        for (const cell of row) {
          if (cell.type === 'static') continue;
          const c = cell.component as InputComponent | SelectComponent | SelectBetweenComponent;
          if (cell.type === 'input') {
            if ((c as InputComponent).evaluation === 'teacher') {
              results[c.id] = 'teacher';
            } else {
              const val = (answers[c.id] ?? '').trim().toLowerCase();
              const correct = (c as InputComponent).correct.trim().toLowerCase();
              const acceptAlso = ((c as InputComponent).acceptAlso ?? []).map((a) => a.trim().toLowerCase());
              results[c.id] = val === correct || acceptAlso.includes(val);
            }
          } else {
            results[c.id] = answers[c.id] === (c as SelectComponent).correct;
          }
        }
      }
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

export function scoreFromResults(results: Record<string, EvalResult>): { score: number; total: number; teacher: number } {
  let score = 0;
  let total = 0;
  let teacher = 0;
  for (const v of Object.values(results)) {
    if (v === 'teacher') { teacher++; continue; }
    total++;
    if (v === true) score++;
  }
  return { score, total, teacher };
}
