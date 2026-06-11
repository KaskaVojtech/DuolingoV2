'use client';

import { useState } from 'react';
import { ContentBlock } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';

export function SpacingSection({ block }: { block: ContentBlock }) {
  const { updateBlock } = useContentEditorStore();
  const [linked, setLinked] = useState(false);

  const set = (side: 'Top' | 'Bottom' | 'Left' | 'Right', val: number) => {
    if (linked) {
      updateBlock(block.id, { paddingTop: val, paddingBottom: val, paddingLeft: val, paddingRight: val });
    } else {
      updateBlock(block.id, { [`padding${side}`]: val });
    }
  };

  const SpacingInput = ({ side }: { side: 'Top' | 'Bottom' | 'Left' | 'Right' }) => (
    <input
      type="number" min={0} max={120}
      className="w-14 bg-admin-surface border border-admin-border rounded-admin-sm px-1 py-1 text-admin-xs text-admin-text text-center"
      value={block[`padding${side}` as keyof ContentBlock] as number}
      onChange={(e) => set(side, Number(e.target.value))}
    />
  );

  return (
    <div className="content-sidebar__section">
      <div className="content-sidebar__section-title">Odsazení (px)</div>
      <div className="spacing-grid mb-2">
        <div className="spacing-grid__top"><SpacingInput side="Top" /></div>
        <div className="spacing-grid__left"><SpacingInput side="Left" /></div>
        <div className="spacing-grid__right"><SpacingInput side="Right" /></div>
        <div className="spacing-grid__bottom"><SpacingInput side="Bottom" /></div>
      </div>
      <button
        type="button"
        onClick={() => setLinked(!linked)}
        className={`text-admin-xs flex items-center gap-1 ${linked ? 'text-admin-primary' : 'text-admin-text-muted hover:text-admin-text'}`}
      >
        <i className={`ti ${linked ? 'ti-link' : 'ti-link-off'} text-[12px]`} aria-hidden="true" />
        {linked ? 'Strany propojeny' : 'Propojit strany'}
      </button>
    </div>
  );
}
