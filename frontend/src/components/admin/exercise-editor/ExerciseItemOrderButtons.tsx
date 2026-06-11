'use client';

import { useExerciseStore } from '@/lib/exercise/exercise.store';

export function ExerciseItemOrderButtons({ itemId, isFirst, isLast }: { itemId: string; isFirst: boolean; isLast: boolean }) {
  const { moveItemUp, moveItemDown } = useExerciseStore();
  return (
    <div className="flex flex-col">
      <button onClick={(e) => { e.stopPropagation(); moveItemUp(itemId); }} disabled={isFirst} aria-label="Přesunout nahoru" aria-disabled={isFirst} className="flex items-center justify-center w-5 h-5 text-admin-text-muted hover:text-admin-text disabled:opacity-30 disabled:cursor-not-allowed">
        <i className="ti ti-chevron-up text-[12px]" aria-hidden="true" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); moveItemDown(itemId); }} disabled={isLast} aria-label="Přesunout dolů" aria-disabled={isLast} className="flex items-center justify-center w-5 h-5 text-admin-text-muted hover:text-admin-text disabled:opacity-30 disabled:cursor-not-allowed">
        <i className="ti ti-chevron-down text-[12px]" aria-hidden="true" />
      </button>
    </div>
  );
}
