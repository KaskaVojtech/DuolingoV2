'use client';

import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { updateBlockConfig } from '@/lib/lesson-content/lesson-content.api';
import { Block } from '@/lib/lesson-content/lesson-content.types';

export function ExerciseBlockSection({ block }: { block: Block }) {
  const { updateBlock } = useLessonContentStore();
  const mandatory = block.exerciseAttributes?.isMandatory ?? false;

  const toggle = async () => {
    const patch = { exerciseAttributes: { isMandatory: !mandatory } };
    updateBlock(block.id, patch);
    await updateBlockConfig(block.id, patch);
  };

  return (
    <div className="mb-admin-lg">
      <h3 className="text-admin-sm font-medium text-admin-text mb-admin-sm">Atributy cvičení</h3>
      <div className="flex items-center justify-between py-2 border-b border-admin-border">
        <div>
          <p className="text-admin-sm text-admin-text">Povinné cvičení</p>
          <p className="text-admin-xs text-admin-text-muted mt-0.5">Povinná cvičení musí být splněna pro dokončení lekce.</p>
        </div>
        <button onClick={toggle} className={`relative w-10 h-5 rounded-full transition-colors ${mandatory ? 'bg-admin-primary' : 'bg-admin-surface-2 border border-admin-border'}`} aria-pressed={mandatory}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${mandatory ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </div>
  );
}
