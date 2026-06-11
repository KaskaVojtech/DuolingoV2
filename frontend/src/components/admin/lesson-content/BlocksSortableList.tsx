'use client';

import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { SortableList } from '@/components/admin/common/sortable/SortableList';
import { BlockRow } from './BlockRow';
import { BlockPlaceholder } from './BlockPlaceholder';

export function BlocksSortableList() {
  const { blocks, reorderBlocks } = useLessonContentStore();
  return (
    <div className="bg-admin-surface border border-admin-border rounded-admin-md overflow-hidden">
      <SortableList items={blocks} onReorder={reorderBlocks}>
        {blocks.map((block, idx) => (
          <BlockRow key={block.id} block={block} isFirst={idx === 0} isLast={idx === blocks.length - 1} />
        ))}
      </SortableList>
      <BlockPlaceholder />
    </div>
  );
}
