'use client';

import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { wouldCreateBlockCycle } from '@/lib/lesson-content/block-constraints.utils';
import { Block, BlockConstraintRule } from '@/lib/lesson-content/lesson-content.types';
import { BlockTypeBadge } from '../BlockTypeBadge';

interface BlockConstraintDropZoneProps {
  targetBlock: Block;
  onAdd: (rule: BlockConstraintRule) => void;
}

export function BlockConstraintDropZone({ targetBlock, onAdd }: BlockConstraintDropZoneProps) {
  const { blocks } = useLessonContentStore();
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');
  const available = blocks.filter((b) => b.id !== targetBlock.id);

  const handleAdd = (source: Block) => {
    if (wouldCreateBlockCycle(targetBlock.id, source.id, blocks)) {
      setError(`"${source.title}" by vytvořilo cyklickou závislost.`);
      return;
    }
    setError('');
    const rule: BlockConstraintRule = {
      id: uuid(),
      sourceBlockId: source.id,
      sourceBlockTitle: source.title,
      sourceBlockType: source.type,
      condition: source.type === 'content'
        ? { type: 'content_read' }
        : { type: 'exercise_completed', mandatory: true },
    };
    onAdd(rule);
    setShowPicker(false);
  };

  return (
    <div className="mb-2">
      <div
        className="block-constraint-drop-zone flex flex-col items-center justify-center gap-2 py-4 cursor-pointer"
        onClick={() => setShowPicker(!showPicker)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowPicker(!showPicker)}
      >
        <i className="ti ti-drag-drop text-[24px] text-admin-text-muted" aria-hidden="true" />
        <p className="text-admin-xs text-admin-text-muted">{showPicker ? 'Vyberte blok:' : 'Klikněte pro přidání podmínky'}</p>
      </div>
      {error && <p className="text-admin-xs text-admin-danger mt-1">{error}</p>}
      {showPicker && (
        <div className="border border-admin-border rounded-admin-sm overflow-hidden mt-1">
          {available.map((b) => (
            <button key={b.id} onClick={() => handleAdd(b)} className="w-full flex items-center gap-2 px-3 py-2 text-admin-xs text-admin-text hover:bg-admin-surface-2 text-left border-b border-admin-border last:border-0">
              <BlockTypeBadge type={b.type} />
              <span className="truncate">{b.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
