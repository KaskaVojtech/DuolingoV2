'use client';

import { useState } from 'react';
import type { DraggableAttributes } from '@dnd-kit/core';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';

interface Props {
  blockId: string;
  isFirst: boolean;
  isLast: boolean;
  dragHandleProps?: Record<string, unknown>;
  dragHandleAttributes?: DraggableAttributes;
}

export function BlockActions({ blockId, isFirst, isLast, dragHandleProps, dragHandleAttributes }: Props) {
  const { moveBlockUp, moveBlockDown, deleteBlock, duplicateBlock } = useContentEditorStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="block-actions">
      <button {...(dragHandleProps as object)} {...(dragHandleAttributes as object)} className="cursor-grab active:cursor-grabbing" aria-label="Přetáhnout blok">
        <i className="ti ti-grip-vertical" aria-hidden="true" />
      </button>
      <button onClick={() => moveBlockUp(blockId)} disabled={isFirst} className={isFirst ? 'opacity-30' : ''} aria-label="Nahoru">
        <i className="ti ti-chevron-up" aria-hidden="true" />
      </button>
      <button onClick={() => moveBlockDown(blockId)} disabled={isLast} className={isLast ? 'opacity-30' : ''} aria-label="Dolů">
        <i className="ti ti-chevron-down" aria-hidden="true" />
      </button>
      <button onClick={() => duplicateBlock(blockId)} aria-label="Duplikovat">
        <i className="ti ti-copy" aria-hidden="true" />
      </button>
      {confirmDelete ? (
        <>
          <button onClick={() => setConfirmDelete(false)} className="text-admin-xs px-1">Zrušit</button>
          <button onClick={() => deleteBlock(blockId)} className="block-actions__delete text-admin-xs px-1">Smazat?</button>
        </>
      ) : (
        <button onClick={() => setConfirmDelete(true)} className="block-actions__delete" aria-label="Smazat">
          <i className="ti ti-trash" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

