'use client';

import { PracticeTypeConfig } from '@/lib/practice/practice.types';
import { PRACTICE_DEFINITIONS } from '@/lib/practice/practice.types';
import { useUIStore } from '@/lib/stores/ui.store';
import { PracticeUnavailableBadge } from './PracticeUnavailableBadge';

interface PracticeTypeCardProps {
  config: PracticeTypeConfig;
  onToggle: (enabled: boolean) => void;
  isPracticeEnabled: boolean;
}

export function PracticeTypeCard({ config, onToggle, isPracticeEnabled }: PracticeTypeCardProps) {
  const def = PRACTICE_DEFINITIONS[config.type];
  const { showToast } = useUIStore();
  const isUnavailable = !config.isAvailable;
  const isToggleDisabled = isUnavailable || !isPracticeEnabled;

  function handleCardClick() {
    if (!isUnavailable) return;
    if (def.requiresAudio) {
      showToast('Přidejte výslovnost ke slovíčkům v sekci Slovíčka', 'info');
    } else if (def.requiresSentences) {
      showToast('Přidejte příkladové věty ke slovíčkům v sekci Slovíčka', 'info');
    }
  }

  return (
    <div
      className={`practice-card ${isUnavailable ? 'practice-card--unavailable' : ''}`}
      onClick={handleCardClick}
      role={isUnavailable ? 'button' : undefined}
      tabIndex={isUnavailable ? 0 : undefined}
      onKeyDown={isUnavailable ? (e) => e.key === 'Enter' && handleCardClick() : undefined}
    >
      <div className="practice-card__icon">
        <i className={`ti ${def.icon}`} />
      </div>
      <p className="practice-card__label">{def.label}</p>
      <p className="practice-card__desc">{def.description}</p>
      <div className="practice-card__footer">
        {isUnavailable ? (
          <PracticeUnavailableBadge reason={config.unavailableReason ?? 'Nedostupné'} />
        ) : (
          <span className="practice-card__status">{config.isEnabled ? 'Aktivní' : 'Neaktivní'}</span>
        )}
        <button
          type="button"
          className={`practice-toggle ${config.isEnabled ? 'practice-toggle--on' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isToggleDisabled) onToggle(!config.isEnabled);
          }}
          disabled={isToggleDisabled}
          aria-checked={config.isEnabled}
          role="switch"
          aria-label={`${def.label} — ${config.isEnabled ? 'zapnuté' : 'vypnuté'}`}
        >
          <span className="practice-toggle__knob" />
        </button>
      </div>
    </div>
  );
}
