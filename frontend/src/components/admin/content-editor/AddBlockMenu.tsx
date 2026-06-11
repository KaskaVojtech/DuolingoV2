'use client';

import { useState } from 'react';
import { ContentBlockType } from '@/lib/content-editor/content-editor.types';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { getBlockLabel } from '@/lib/content-editor/content-editor.utils';

const BLOCK_TYPES: { type: ContentBlockType; icon: string }[] = [
  { type: 'paragraph', icon: 'ti-pilcrow' },
  { type: 'heading',   icon: 'ti-heading' },
  { type: 'image',     icon: 'ti-photo' },
  { type: 'video',     icon: 'ti-movie' },
  { type: 'audio',     icon: 'ti-music' },
  { type: 'table',     icon: 'ti-table' },
  { type: 'embed',     icon: 'ti-code' },
];

interface Props { afterId?: string }

export function AddBlockMenu({ afterId }: Props) {
  const [open, setOpen] = useState(false);
  const { addBlock } = useContentEditorStore();

  const handleAdd = (type: ContentBlockType) => {
    addBlock(type, afterId);
    setOpen(false);
  };

  return (
    <div className="add-block-line">
      <div className="add-block-line__line" />
      <div className="relative">
        <button
          type="button"
          className="add-block-line__btn"
          onClick={() => setOpen(!open)}
          aria-label="Přidat blok"
        >
          <i className="ti ti-plus text-[14px]" aria-hidden="true" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
            <div className="absolute left-1/2 -translate-x-1/2 top-7 z-50 bg-admin-surface border border-admin-border rounded-admin-md p-admin-sm shadow-lg grid grid-cols-4 gap-1 w-56">
              {BLOCK_TYPES.map(({ type, icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleAdd(type)}
                  className="flex flex-col items-center gap-1 p-2 rounded-admin-sm text-admin-xs text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2 transition-colors"
                >
                  <i className={`ti ${icon} text-[16px]`} aria-hidden="true" />
                  {getBlockLabel(type)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="add-block-line__line" />
    </div>
  );
}
