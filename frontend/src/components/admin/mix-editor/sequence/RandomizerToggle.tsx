'use client';

import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';

export function RandomizerToggle() {
  const { mix, toggleRandomizer } = useMixEditorStore();

  return (
    <label className="randomizer-toggle" title="Náhodné pořadí her">
      <i className="ti ti-arrows-shuffle" />
      <span>Náhodné pořadí</span>
      <div
        className={`randomizer-toggle__switch ${mix.isRandomOrder ? 'randomizer-toggle__switch--on' : ''}`}
        onClick={toggleRandomizer}
        role="switch"
        aria-checked={mix.isRandomOrder}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleRandomizer()}
      >
        <span className="randomizer-toggle__knob" />
      </div>
    </label>
  );
}
