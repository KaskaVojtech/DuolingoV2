'use client';

import { HeadingBlock } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { getHeadingFontSize } from '@/lib/content-editor/content-editor.utils';

export function HeadingLevelSection({ block }: { block: HeadingBlock }) {
  const { updateBlock } = useContentEditorStore();

  return (
    <div className="content-sidebar__section">
      <div className="content-sidebar__section-title">Úroveň nadpisu</div>
      <div className="flex gap-1">
        {([1, 2, 3, 4, 5, 6] as const).map((level) => (
          <button key={level} type="button"
            onClick={() => updateBlock(block.id, { level, fontSize: getHeadingFontSize(level) } as Partial<HeadingBlock>)}
            className={`flex-1 py-1.5 text-admin-xs font-medium rounded border transition-colors ${block.level === level ? 'bg-admin-primary text-white border-admin-primary' : 'border-admin-border text-admin-text-muted hover:text-admin-text'}`}
          >H{level}</button>
        ))}
      </div>
    </div>
  );
}
