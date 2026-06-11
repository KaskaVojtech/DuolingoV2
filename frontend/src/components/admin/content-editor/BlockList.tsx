'use client';

import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { SortableList } from '@/components/admin/common/sortable/SortableList';
import { BlockWrapper } from './BlockWrapper';
import { AddBlockMenu } from './AddBlockMenu';

interface Props {
  onSelectionChange: (range: Range | null) => void;
}

export function BlockList({ onSelectionChange }: Props) {
  const { content, reorderBlocks, selectBlock } = useContentEditorStore();
  const { blocks } = content;

  return (
    <div
      className="content-editor__blocks"
      onClick={(e) => { if (e.target === e.currentTarget) selectBlock(null); }}
    >
      <SortableList items={blocks} onReorder={reorderBlocks}>
        {blocks.map((block, idx) => (
          <BlockWrapper
            key={block.id}
            block={block}
            isFirst={idx === 0}
            isLast={idx === blocks.length - 1}
            onSelectionChange={onSelectionChange}
          />
        ))}
      </SortableList>

      {blocks.length === 0 && (
        <div className="py-16 text-center text-admin-text-muted text-admin-sm">
          Prázdný obsah — přidejte první blok níže.
        </div>
      )}

      <AddBlockMenu />
    </div>
  );
}
