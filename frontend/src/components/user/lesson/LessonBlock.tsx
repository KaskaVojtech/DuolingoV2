'use client';

/**
 * Renders a single lesson block (content / exercise / mix) including lock, read confirmation and result submission.
 */

import { useQueryClient } from '@tanstack/react-query';
import { ContentPreview } from '@/components/admin/content-editor/preview/ContentPreview';
import { ContentBlock } from '@/lib/content-editor/content-editor.types';
import { ExerciseItem } from '@/lib/exercise/exercise.types';
import { SequenceGame } from '@/lib/mix-editor/mix-editor.types';
import { UserLessonBlock, completeBlock, submitActivity } from '@/lib/user-auth/user-lesson.api';
import { ExercisePlayer } from './ExercisePlayer';
import { MixPlayer } from './MixPlayer';

const LOCK_LABEL: Record<NonNullable<UserLessonBlock['lockReason']>, string> = {
  locked: 'Tento blok je zamčený',
  scheduled_future: 'Blok se odemkne později',
  scheduled_past: 'Blok je již uzavřený',
  constraint: 'Nejdřív dokonči předchozí bloky',
};

const TYPE_META = {
  content:  { icon: 'ti-file-text', label: 'Obsah',    color: 'var(--color-block-content-primary)' },
  exercise: { icon: 'ti-pencil',    label: 'Cvičení',  color: 'var(--color-block-exercise-primary)' },
  mix:      { icon: 'ti-cards',     label: 'Hry',      color: 'var(--color-block-mix-primary)' },
} as const;

export function LessonBlock({ block, lessonId }: { block: UserLessonBlock; lessonId: string }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['user-lesson-content', lessonId] });

  const meta = TYPE_META[block.type];

  const handleSubmit = async (kind: 'exercise' | 'mix', payload: { score: number; total: number; xp: number }) => {
    try {
      await submitActivity(block.id, { kind, ...payload });
      invalidate();
    } catch {

    }
  };

  const handleMarkRead = async () => {
    await completeBlock(block.id);
    invalidate();
  };

  return (
    <section className={`admin-card p-admin-lg ${block.isLocked ? 'lesson-block--locked' : ''}`}>

      <header className="flex items-center gap-2 mb-admin-md">
        <i className={`ti ${meta.icon}`} style={{ color: meta.color }} />
        <h3 className="text-admin-base font-bold text-admin-text flex-1">{block.title}</h3>
        {block.type === 'exercise' && block.isMandatory && (
          <span className="text-admin-xs px-2 py-0.5 rounded-full bg-admin-surface-2 text-admin-text-muted border border-admin-border">
            povinné
          </span>
        )}
        {block.isCompleted && (
          <span className="flex items-center gap-1 text-admin-xs text-[#2db868] font-semibold">
            <i className="ti ti-circle-check-filled" /> hotovo
          </span>
        )}
      </header>

      {block.isLocked && (
        <div className="flex items-center gap-2 text-admin-sm text-admin-text-muted py-admin-md">
          <i className="ti ti-lock text-[18px]" />
          {LOCK_LABEL[block.lockReason ?? 'locked']}
          {block.lockReason === 'scheduled_future' && block.unlockAt && (
            <span>· {new Date(block.unlockAt).toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          )}
        </div>
      )}

      {!block.isLocked && block.type === 'content' && block.content && (
        <>
          <ContentPreview blocks={(block.content.blocks ?? []) as ContentBlock[]} />
          {block.requiresReadConfirmation && !block.isCompleted && (
            <div className="mt-admin-md pt-admin-md border-t border-admin-border">
              <button onClick={handleMarkRead} className="admin-btn admin-btn--primary admin-btn--md">
                <i className="ti ti-check" /> Označit jako přečteno
              </button>
            </div>
          )}
        </>
      )}

      {!block.isLocked && block.type === 'exercise' && block.exercise && (
        <ExercisePlayer
          blockId={block.id}
          instructions={block.exercise.instructions}
          xp={block.exercise.xp}
          items={(block.exercise.items ?? []) as ExerciseItem[]}
          previousResult={block.result}
          onSubmit={(p) => handleSubmit('exercise', p)}
        />
      )}

      {!block.isLocked && block.type === 'mix' && block.mix && (
        <MixPlayer
          blockId={block.id}
          games={(block.mix.games ?? []) as SequenceGame[]}
          isRandomOrder={block.mix.isRandomOrder}
          xp={block.mix.xp}
          previousResult={block.result}
          onSubmit={(p) => handleSubmit('mix', p)}
        />
      )}
    </section>
  );
}
