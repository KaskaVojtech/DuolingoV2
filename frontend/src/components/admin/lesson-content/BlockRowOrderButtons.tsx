'use client';

import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';

export function BlockRowOrderButtons({ blockId, isFirst, isLast }: { blockId: string; isFirst: boolean; isLast: boolean }) {
  const { moveBlockUp, moveBlockDown } = useLessonContentStore();
  return (
    <div className="flex flex-col">
      <button onClick={(e) => { e.stopPropagation(); moveBlockUp(blockId); }} disabled={isFirst} aria-label="Přesunout blok nahoru" aria-disabled={isFirst} className="flex items-center justify-center w-5 h-5 text-admin-text-muted hover:text-admin-text disabled:opacity-30 disabled:cursor-not-allowed">
        <i className="ti ti-chevron-up text-[12px]" aria-hidden="true" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); moveBlockDown(blockId); }} disabled={isLast} aria-label="Přesunout blok dolů" aria-disabled={isLast} className="flex items-center justify-center w-5 h-5 text-admin-text-muted hover:text-admin-text disabled:opacity-30 disabled:cursor-not-allowed">
        <i className="ti ti-chevron-down text-[12px]" aria-hidden="true" />
      </button>
    </div>
  );
}
