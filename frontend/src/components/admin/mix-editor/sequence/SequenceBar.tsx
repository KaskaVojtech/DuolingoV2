'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';
import { estimateTotalTime, formatTime } from '@/lib/mix-editor/mix-editor.utils';
import { SequenceGameBlock } from './SequenceGameBlock';
import { SequenceDropZone } from './SequenceDropZone';
import { RandomizerToggle } from './RandomizerToggle';

export function SequenceBar() {
  const { mix, addGame, reorderGames } = useMixEditorStore();
  const totalTime = estimateTotalTime(mix);
  const atMax = mix.games.length >= 20;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;

    if (activeData?.type === 'library-item') {
      addGame(activeData.gameType, over.id !== 'seq-end' ? String(over.id) : undefined);
    } else if (active.id !== over.id) {
      reorderGames(String(active.id), String(over.id));
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="mix-editor__seq">
        <div className="sequence-bar">
          <SortableContext items={mix.games.map((g) => g.id)} strategy={horizontalListSortingStrategy}>
            {mix.games.map((game, idx) => (
              <div key={game.id} className="sequence-bar__slot">
                {idx === 0 && <SequenceDropZone id={`drop-before-${game.id}`} />}
                <SequenceGameBlock game={game} />
                <SequenceDropZone id={game.id} />
              </div>
            ))}
          </SortableContext>

          {!atMax && (
            <button
              type="button"
              className="sequence-bar__add"
              onClick={() => {}}
              aria-label="Přidat hru (přetáhněte z knihovny)"
              title="Přetáhněte hru z levého panelu nebo klikněte na typ hry"
              id="seq-end"
            >
              <i className="ti ti-plus" />
            </button>
          )}

          <div className="sequence-bar__meta">
            <RandomizerToggle />
            {totalTime > 0 && (
              <span>
                <i className="ti ti-clock" /> {formatTime(totalTime)}
              </span>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
