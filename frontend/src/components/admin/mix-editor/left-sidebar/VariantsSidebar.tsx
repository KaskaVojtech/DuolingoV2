'use client';

import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';
import { GAME_REGISTRY } from '@/lib/mix-editor/game-registry';
import { VariantThumbnail } from './VariantThumbnail';
import { AdminButton } from '../../common/AdminButton';

export function VariantsSidebar() {
  const { mix, activeGameId, addVariant, isGenerating, autoGenerateVariant } = useMixEditorStore();
  const game = mix.games.find((g) => g.id === activeGameId);

  if (!game) {
    return (
      <div className="variants-sidebar variants-sidebar--empty">
        <p>Vyberte hru v sekvenci</p>
      </div>
    );
  }

  const plugin = GAME_REGISTRY[game.type];

  return (
    <div className="variants-sidebar">
      <p className="variants-sidebar__title">{plugin.label}</p>
      <p className="variants-sidebar__subtitle">Varianty ({game.variants.length})</p>
      <div className="variants-sidebar__list">
        {game.variants.map((variant, i) => (
          <VariantThumbnail key={variant.id} gameId={game.id} variantId={variant.id} index={i} />
        ))}
      </div>
      <div className="variants-sidebar__actions">
        <AdminButton variant="ghost" size="sm" icon="ti-plus" onClick={() => addVariant(game.id)}>
          Přidat variantu
        </AdminButton>
        <AdminButton
          variant="ghost"
          size="sm"
          icon="ti-bolt"
          loading={isGenerating}
          onClick={() => autoGenerateVariant(game.id)}
        >
          Auto-generovat
        </AdminButton>
      </div>
    </div>
  );
}
