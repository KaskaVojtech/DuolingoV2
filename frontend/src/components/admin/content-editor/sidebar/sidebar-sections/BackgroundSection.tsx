'use client';

import { ContentBlock } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { ColorPicker } from '@/components/admin/common/ColorPicker';

export function BackgroundSection({ block }: { block: ContentBlock }) {
  const { updateBlock } = useContentEditorStore();
  return (
    <div className="content-sidebar__section">
      <div className="content-sidebar__section-title">Pozadí</div>
      <ColorPicker
        value={block.backgroundColor}
        onChange={(c) => updateBlock(block.id, { backgroundColor: c })}
        onNull={() => updateBlock(block.id, { backgroundColor: null })}
        allowNull
        nullLabel="Průhledné"
      />
    </div>
  );
}
