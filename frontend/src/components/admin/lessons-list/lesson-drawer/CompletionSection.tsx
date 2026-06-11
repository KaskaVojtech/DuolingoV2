'use client';

import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';
import { updateLessonConfig } from '@/lib/lessons-list/lessons-list.api';
import { CompletionMode, BlockScope, Lesson } from '@/lib/lessons-list/lessons-list.types';

interface CompletionSectionProps { lesson: Lesson; }

const BLOCK_SCOPES: { value: BlockScope; label: string }[] = [
  { value: 'exercise', label: 'Cvičební bloky' },
  { value: 'content',  label: 'Obsahové bloky' },
  { value: 'both',     label: 'Obojí' },
];

export function CompletionSection({ lesson }: CompletionSectionProps) {
  const { updateLesson } = useLessonsListStore();

  const setMode = async (mode: CompletionMode) => {
    const patch = { completion: { ...lesson.completion, mode } };
    updateLesson(lesson.id, patch);
    await updateLessonConfig(lesson.id, patch);
  };

  const setScope = async (blockScope: BlockScope) => {
    const patch = { completion: { ...lesson.completion, blockScope } };
    updateLesson(lesson.id, patch);
    await updateLessonConfig(lesson.id, patch);
  };

  return (
    <div className="mb-admin-lg">
      <h3 className="text-admin-sm font-medium text-admin-text mb-admin-sm">Splnění lekce</h3>
      <div className="flex border border-admin-border rounded-admin-sm overflow-hidden mb-admin-sm">
        {(['manual_button', 'blocks_completion'] as CompletionMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-1.5 text-admin-xs font-medium transition-colors ${
              lesson.completion.mode === m
                ? 'bg-admin-primary text-white'
                : 'bg-admin-surface-2 text-admin-text-muted hover:text-admin-text'
            }`}
          >
            {m === 'manual_button' ? 'Tlačítko Splnit' : 'Splnění bloků'}
          </button>
        ))}
      </div>
      <p className="text-admin-xs text-admin-text-muted mb-admin-sm">
        {lesson.completion.mode === 'manual_button'
          ? "U lekce se uživateli zobrazí tlačítko 'Označit jako splněnou'."
          : 'Lekce je splněna automaticky po dokončení povinných bloků.'}
      </p>
      {lesson.completion.mode === 'blocks_completion' && (
        <div>
          <p className="text-admin-xs text-admin-text-muted mb-1">Vztahuje se na:</p>
          <div className="flex border border-admin-border rounded-admin-sm overflow-hidden">
            {BLOCK_SCOPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setScope(value)}
                className={`flex-1 py-1.5 text-admin-xs font-medium transition-colors ${
                  lesson.completion.blockScope === value
                    ? 'bg-admin-surface text-admin-text'
                    : 'bg-admin-surface-2 text-admin-text-muted hover:text-admin-text'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
