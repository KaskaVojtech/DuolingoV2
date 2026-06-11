'use client';

import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { useUIStore } from '@/lib/stores/ui.store';
import { Block } from '@/lib/lesson-content/lesson-content.types';

export function BlockRowActions({ block }: { block: Block }) {
  const { openDrawer } = useLessonContentStore();
  const openModal = useUIStore((s) => s.openModal);

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={(e) => { e.stopPropagation(); openModal('deleteBlock', { blockId: block.id, blockTitle: block.title, blockType: block.type }); }}
        title="Smazat blok"
        className="w-7 h-7 flex items-center justify-center text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger-bg rounded-admin-sm transition-colors"
      >
        <i className="ti ti-trash text-[14px]" aria-hidden="true" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); openDrawer(block.id); }}
        title="Nastavení bloku"
        className="w-7 h-7 flex items-center justify-center text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-2 rounded-admin-sm transition-colors"
      >
        <i className="ti ti-dots text-[14px]" aria-hidden="true" />
      </button>
    </div>
  );
}
