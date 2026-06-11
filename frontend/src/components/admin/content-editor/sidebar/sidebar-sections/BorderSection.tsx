'use client';

import { ContentBlock } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { ColorPicker } from '@/components/admin/common/ColorPicker';

export function BorderSection({ block }: { block: ContentBlock }) {
  const { updateBlock } = useContentEditorStore();

  return (
    <div className="content-sidebar__section">
      <div className="content-sidebar__section-title">Rámeček</div>

      <div className="mb-3 flex items-center gap-2">
        <label className="text-admin-xs text-admin-text-muted">Tloušťka</label>
        <input type="number" min={0} max={8}
          className="w-16 bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text text-center"
          value={block.borderWidth}
          onChange={(e) => updateBlock(block.id, { borderWidth: Number(e.target.value) })}
        />
        <span className="text-admin-xs text-admin-text-muted">px</span>
      </div>

      <div className={`mb-3 ${block.borderWidth === 0 ? 'opacity-40 pointer-events-none' : ''}`}>
        <p className="text-admin-xs text-admin-text-muted mb-1">Barva okraje</p>
        <ColorPicker
          value={block.borderColor ?? '#2c2e4d'}
          onChange={(c) => updateBlock(block.id, { borderColor: c })}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-admin-xs text-admin-text-muted">Zaoblení</label>
        <input type="range" min={0} max={32}
          className="flex-1 accent-admin-primary"
          value={block.borderRadius}
          onChange={(e) => updateBlock(block.id, { borderRadius: Number(e.target.value) })}
        />
        <span className="text-admin-xs text-admin-text-muted w-8">{block.borderRadius}px</span>
      </div>
    </div>
  );
}
