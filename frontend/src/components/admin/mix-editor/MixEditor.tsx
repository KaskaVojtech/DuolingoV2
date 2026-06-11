'use client';

import { useState } from 'react';
import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';
import { validateMix } from '@/lib/mix-editor/mix-editor.utils';
import { MixEditorTopBar } from './MixEditorTopBar';
import { GameLibrary } from './left-sidebar/GameLibrary';
import { VariantsSidebar } from './left-sidebar/VariantsSidebar';
import { GameEditorPanel } from './game-editor/GameEditorPanel';
import { SequenceBar } from './sequence/SequenceBar';
import { MixRightSidebar } from './right-sidebar/MixRightSidebar';
import { AdminErrorBanner } from '../common/AdminErrorBanner';

type LeftMode = 'library' | 'variants';

export function MixEditor() {
  const { mix, activeGameId } = useMixEditorStore();
  const [leftMode, setLeftMode] = useState<LeftMode>(activeGameId ? 'variants' : 'library');

  const errors = validateMix(mix);

  function handleSidebarToggle(mode: LeftMode) {
    setLeftMode(mode);
  }

  return (
    <div className="mix-editor">
      <MixEditorTopBar />

      <div className="mix-editor__left">
        <div className="mix-editor__left-tabs">
          <button
            type="button"
            className={`mix-editor__left-tab ${leftMode === 'library' ? 'mix-editor__left-tab--active' : ''}`}
            onClick={() => handleSidebarToggle('library')}
            title="Knihovna her"
            aria-label="Knihovna her"
          >
            <i className="ti ti-layout-grid" />
          </button>
          <button
            type="button"
            className={`mix-editor__left-tab ${leftMode === 'variants' ? 'mix-editor__left-tab--active' : ''}`}
            onClick={() => handleSidebarToggle('variants')}
            title="Varianty aktivní hry"
            aria-label="Varianty aktivní hry"
            disabled={!activeGameId}
          >
            <i className="ti ti-layout-sidebar" />
          </button>
        </div>

        {leftMode === 'library' ? <GameLibrary /> : <VariantsSidebar />}
      </div>

      <div className="mix-editor__main">
        {errors.length > 0 && (
          <AdminErrorBanner message={errors.join(' | ')} />
        )}
        <GameEditorPanel />
      </div>

      <MixRightSidebar />

      <SequenceBar />
    </div>
  );
}
