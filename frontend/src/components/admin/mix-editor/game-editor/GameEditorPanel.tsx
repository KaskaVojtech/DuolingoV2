'use client';

import { Suspense } from 'react';
import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';
import { GAME_REGISTRY } from '@/lib/mix-editor/game-registry';
import { GameEditorEmpty } from './GameEditorEmpty';

export function GameEditorPanel() {
  const { activeGameId, activeVariantId, mix, lessonWords, updateVariantData } = useMixEditorStore();

  if (!activeGameId) return <GameEditorEmpty />;

  const game = mix.games.find((g) => g.id === activeGameId);
  if (!game) return <GameEditorEmpty />;

  const variantId = activeVariantId ?? game.activeVariantId;
  const variant = game.variants.find((v) => v.id === variantId);
  if (!variant) return <GameEditorEmpty />;

  const plugin = GAME_REGISTRY[game.type];
  const Editor = plugin.EditorComponent;

  return (
    <div className="game-editor-panel">
      <Suspense fallback={<div className="game-editor-panel__loading"><i className="ti ti-loader-2 animate-spin" /></div>}>
        <Editor
          data={variant.data as never}
          onChange={(data) => updateVariantData(game.id, variant.id, data)}
          lessonWords={lessonWords}
        />
      </Suspense>
    </div>
  );
}
