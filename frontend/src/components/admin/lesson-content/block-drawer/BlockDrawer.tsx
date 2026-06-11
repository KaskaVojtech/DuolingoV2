'use client';

import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { SlideDrawer } from '@/components/admin/common/SlideDrawer';
import { BlockRenameField } from './BlockRenameField';
import { BlockTypeSection } from './BlockTypeSection';
import { BlockLockSection } from './BlockLockSection';

export function BlockDrawer() {
  const { isDrawerOpen, drawerBlockId, blocks, closeDrawer } = useLessonContentStore();
  const block = blocks.find((b) => b.id === drawerBlockId);
  return (
    <SlideDrawer isOpen={isDrawerOpen} onClose={closeDrawer} title="Nastavení bloku">
      {block && (
        <div className="flex flex-col gap-admin-lg">
          <BlockRenameField blockId={block.id} currentTitle={block.title} />
          <BlockTypeSection block={block} />
          <BlockLockSection block={block} />
        </div>
      )}
    </SlideDrawer>
  );
}
