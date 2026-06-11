'use client';

import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';
import { GAME_REGISTRY } from '@/lib/mix-editor/game-registry';

export function GameSettingsSection() {
  const { activeGameId, mix } = useMixEditorStore();
  const game = activeGameId ? mix.games.find((g) => g.id === activeGameId) : null;

  if (!game) {
    return (
      <div className="mix-right-sidebar__section">
        <p className="mix-right-sidebar__empty">Vyberte hru pro nastavení</p>
      </div>
    );
  }

  const plugin = GAME_REGISTRY[game.type];

  return (
    <div className="mix-right-sidebar__section">
      <p className="mix-right-sidebar__section-title">Nastavení hry</p>
      <div className="mix-right-sidebar__game-info">
        <span className="mix-right-sidebar__game-icon" style={{ background: plugin.color }}>
          <i className={`ti ${plugin.icon}`} />
        </span>
        <span className="mix-right-sidebar__game-name">{plugin.label}</span>
      </div>
      <p className="mix-right-sidebar__hint">
        {game.variants.length} varianta(y) — žák dostane náhodnou
      </p>
    </div>
  );
}
