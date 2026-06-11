'use client';

import { useExerciseStore } from '@/lib/exercise/exercise.store';
import { SortableList } from '@/components/admin/common/sortable/SortableList';
import { ExerciseItemRow } from './ExerciseItemRow';
import { AddItemToolbar } from './AddItemToolbar';

export function ExerciseItemsList() {
  const { exercise, reorderItems } = useExerciseStore();
  const { items } = exercise;

  return (
    <div>
      <SortableList items={items} onReorder={reorderItems}>
        {items.map((item, idx) => (
          <ExerciseItemRow key={item.id} item={item} isFirst={idx === 0} isLast={idx === items.length - 1} />
        ))}
      </SortableList>
      {items.length === 0 && (
        <div className="py-admin-2xl text-center text-admin-text-muted text-admin-sm">
          Cvičení nemá žádné bloky. Přidejte první blok níže.
        </div>
      )}
      <AddItemToolbar />
    </div>
  );
}
