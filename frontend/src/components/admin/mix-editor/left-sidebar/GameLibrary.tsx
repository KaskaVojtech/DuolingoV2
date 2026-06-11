'use client';

import { GAME_REGISTRY } from '@/lib/mix-editor/game-registry';
import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';
import { GameLibraryItem } from './GameLibraryItem';

const GAME_ORDER = ['connector', 'fill_in', 'multiple_choice', 'listening', 'word_order', 'translation', 'word_transform'] as const;

export function GameLibrary() {
  const { mix } = useMixEditorStore();
  const atMax = mix.games.length >= 20;

  return (
    <div className="game-library">
      <p className="game-library__title">Přidat hru</p>
      <div className="game-library__list">
        {GAME_ORDER.map((type) => (
          <GameLibraryItem key={type} plugin={GAME_REGISTRY[type] as never} disabled={atMax} />
        ))}
      </div>
    </div>
  );
}
