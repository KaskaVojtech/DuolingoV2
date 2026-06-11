'use client';

import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { updateBlockConfig } from '@/lib/lesson-content/lesson-content.api';
import { Block } from '@/lib/lesson-content/lesson-content.types';

export function ContentBlockSection({ block }: { block: Block }) {
  const { updateBlock } = useLessonContentStore();
  const required = block.contentAttributes?.requiresReadConfirmation ?? false;

  const toggle = async () => {
    const patch = { contentAttributes: { requiresReadConfirmation: !required } };
    updateBlock(block.id, patch);
    await updateBlockConfig(block.id, patch);
  };

  return (
    <div className="mb-admin-lg">
      <h3 className="text-admin-sm font-medium text-admin-text mb-admin-sm">Atributy bloku obsahu</h3>
      <div className="flex items-center justify-between py-2 border-b border-admin-border">
        <div>
          <p className="text-admin-sm text-admin-text">Potvrzení o přečtení</p>
          {required && <p className="text-admin-xs text-admin-text-muted mt-0.5">U bloku se zobrazí tlačítko &lsquo;Označit jako přečtené&rsquo;.</p>}
        </div>
        <button onClick={toggle} className={`relative w-10 h-5 rounded-full transition-colors ${required ? 'bg-admin-primary' : 'bg-admin-surface-2 border border-admin-border'}`} aria-pressed={required}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${required ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </div>
  );
}
