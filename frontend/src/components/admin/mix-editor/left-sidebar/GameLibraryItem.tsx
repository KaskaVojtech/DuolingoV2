'use client';

import { useDraggable } from '@dnd-kit/core';
import { GamePlugin } from '@/lib/mix-editor/mix-editor.types';
import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';

interface GameLibraryItemProps {
  plugin: GamePlugin<never>;
  disabled: boolean;
}

export function GameLibraryItem({ plugin, disabled }: GameLibraryItemProps) {
  const { addGame } = useMixEditorStore();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${plugin.type}`,
    data: { type: 'library-item', gameType: plugin.type },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      className={`game-library-item ${isDragging ? 'game-library-item--dragging' : ''} ${disabled ? 'game-library-item--disabled' : ''}`}
      onClick={() => !disabled && addGame(plugin.type)}
      onKeyDown={(e) => e.key === 'Enter' && !disabled && addGame(plugin.type)}
      {...attributes}
      {...listeners}
      title={disabled ? 'Dosažen max. počet her (20)' : `Přidat: ${plugin.label}`}
    >
      <span className="game-library-item__icon" style={{ background: plugin.color }}>
        <i className={`ti ${plugin.icon}`} />
      </span>
      <span className="game-library-item__text">
        <span className="game-library-item__label">{plugin.label}</span>
        <span className="game-library-item__desc">{plugin.description}</span>
      </span>
    </div>
  );
}
