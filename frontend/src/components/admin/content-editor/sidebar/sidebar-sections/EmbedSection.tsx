'use client';

import { useState } from 'react';
import { EmbedBlock } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';

export function EmbedSection({ block }: { block: EmbedBlock }) {
  const { updateBlock } = useContentEditorStore();
  const [urlVal, setUrlVal] = useState(block.url);

  return (
    <div className="content-sidebar__section">
      <div className="content-sidebar__section-title">Embed</div>

      <div className="mb-3">
        <label className="text-admin-xs text-admin-text-muted block mb-1">URL embedu</label>
        <div className="flex gap-1">
          <input
            className="flex-1 bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text"
            value={urlVal}
            onChange={(e) => setUrlVal(e.target.value)}
            placeholder="https://..."
            onKeyDown={(e) => { if (e.key === 'Enter') updateBlock(block.id, { url: urlVal }); }}
          />
          <button type="button" onClick={() => updateBlock(block.id, { url: urlVal })}
            className="px-2 py-1 text-admin-xs bg-admin-primary text-white rounded-admin-sm">OK</button>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-admin-xs text-admin-text-muted mb-1">Poměr stran</p>
        <div className="flex gap-1">
          {(['16:9', '4:3', '1:1'] as const).map((r) => (
            <button key={r} type="button"
              onClick={() => updateBlock(block.id, { aspectRatio: r })}
              className={`flex-1 py-1 text-admin-xs rounded border transition-colors ${block.aspectRatio === r ? 'bg-admin-primary text-white border-admin-primary' : 'border-admin-border text-admin-text-muted hover:text-admin-text'}`}
            >{r}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-admin-xs text-admin-text-muted block mb-1">Popisek</label>
        <input
          className="w-full bg-admin-surface border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text"
          value={block.caption}
          onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
          placeholder="Popisek..."
        />
      </div>
    </div>
  );
}
