'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SequenceGame } from '@/lib/mix-editor/mix-editor.types';
import { GAME_REGISTRY } from '@/lib/mix-editor/game-registry';
import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';

interface SequenceGameBlockProps {
  game: SequenceGame;
}

export function SequenceGameBlock({ game }: SequenceGameBlockProps) {
  const { activeGameId, selectGame, removeGame } = useMixEditorStore();
  const plugin = GAME_REGISTRY[game.type];
  const isActive = activeGameId === game.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: game.id,
    data: { type: 'sequence-game' },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, background: plugin.color }}
      className={`sequence-game-block ${isActive ? 'sequence-game-block--active' : ''}`}
      onClick={() => selectGame(game.id)}
      onKeyDown={(e) => e.key === 'Enter' && selectGame(game.id)}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        className="sequence-game-block__remove"
        onClick={(e) => { e.stopPropagation(); removeGame(game.id); }}
        aria-label="Smazat hru"
        title="Smazat hru"
      >
        <i className="ti ti-x" />
      </button>
      <i className={`ti ${plugin.icon} sequence-game-block__icon`} />
      <span className="sequence-game-block__label">
        {plugin.label.slice(0, 6)} ({game.variants.length})
      </span>
    </div>
  );
}
