'use client';

import { GameSettingsSection } from './GameSettingsSection';
import { AutoGenerateSection } from './AutoGenerateSection';

export function MixRightSidebar() {
  return (
    <div className="mix-editor__right mix-right-sidebar">
      <GameSettingsSection />
      <AutoGenerateSection />
    </div>
  );
}
