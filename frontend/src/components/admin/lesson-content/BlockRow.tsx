'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SortableItem } from '@/components/admin/common/sortable/SortableItem';
import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { updateBlockConfig } from '@/lib/lesson-content/lesson-content.api';
import { Block } from '@/lib/lesson-content/lesson-content.types';
import { BlockTypeBadge } from './BlockTypeBadge';
import { BlockRowActions } from './BlockRowActions';
import { BlockRowOrderButtons } from './BlockRowOrderButtons';

interface BlockRowProps { block: Block; isFirst: boolean; isLast: boolean; }

export function BlockRow({ block, isFirst, isLast }: BlockRowProps) {
  const router = useRouter();
  const { updateBlock } = useLessonContentStore();
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      if (block.type === 'mix') {
        router.push(`/admin/lessons/${block.lessonId}/mix`);
      } else {
        router.push(`/admin/blocks/${block.id}/edit-${block.type === 'content' ? 'content' : 'exercise'}`);
      }
    } else {
      clickTimer.current = setTimeout(() => { clickTimer.current = null; }, 250);
    }
  };

  const toggleLock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLocked = !block.isLocked;
    const patch = { isLocked: newLocked, lockConfig: { ...block.lockConfig, isLocked: newLocked } };
    updateBlock(block.id, patch);
    await updateBlockConfig(block.id, patch);
  };

  const rowClass = block.isLocked ? 'block-row--locked' : `block-row--${block.type}`;

  return (
    <SortableItem id={block.id}>
      {({ attributes, listeners, isDragging, setNodeRef, style }) => (
        <div
          ref={setNodeRef}
          style={style}
          onClick={handleClick}
          className={`block-row group flex items-center gap-3 px-admin-md py-3 bg-admin-surface border-b border-admin-border cursor-pointer select-none transition-colors hover:bg-admin-surface-2 ${rowClass} ${isDragging ? 'block-row--dragging' : ''}`}
        >
          <button {...listeners} {...attributes} className="block-drag-handle shrink-0 w-5 h-5 flex items-center justify-center" aria-label={`Přetáhnout blok ${block.title}`} onClick={(e) => e.stopPropagation()}>
            <i className="ti ti-grip-vertical text-[16px]" aria-hidden="true" />
          </button>
          <button onClick={toggleLock} title={block.isLocked ? 'Odemknout blok' : 'Zamknout blok'} className="shrink-0">
            <i className={`ti ${block.isLocked ? 'ti-lock text-admin-text-muted' : 'ti-lock-open text-admin-text-muted'} text-[16px]`} aria-hidden="true" />
          </button>
          <span className={`flex-1 text-admin-sm font-medium truncate ${block.isLocked ? 'text-admin-text-muted' : 'text-admin-text'}`}>{block.title}</span>
          <BlockTypeBadge type={block.type} />
          <div onClick={(e) => e.stopPropagation()}>
            <BlockRowOrderButtons blockId={block.id} isFirst={isFirst} isLast={isLast} />
          </div>
          <BlockRowActions block={block} />
        </div>
      )}
    </SortableItem>
  );
}
