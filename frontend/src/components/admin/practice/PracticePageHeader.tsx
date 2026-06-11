'use client';

import { LessonPracticeConfig } from '@/lib/practice/practice.types';
import { formatLastGenerated } from '@/lib/practice/practice.utils';
import { AdminButton } from '../common/AdminButton';

interface PracticePageHeaderProps {
  config: LessonPracticeConfig;
  onToggleMaster: (enabled: boolean) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function PracticePageHeader({ config, onToggleMaster, onRegenerate, isRegenerating }: PracticePageHeaderProps) {
  return (
    <div className="practice-header">
      <div className="practice-header__master-row">
        <div>
          <p className="text-admin-sm text-admin-text-muted">
            Automaticky generovaná cvičení ze slovíček lekce.
          </p>
        </div>
        <label className="practice-master-toggle" aria-label="Zapnout/vypnout procvičování">
          <span className="text-admin-sm text-admin-text">Procvičování aktivní:</span>
          <button
            type="button"
            className={`practice-toggle practice-toggle--lg ${config.isPracticeEnabled ? 'practice-toggle--on' : ''}`}
            onClick={() => onToggleMaster(!config.isPracticeEnabled)}
            role="switch"
            aria-checked={config.isPracticeEnabled}
          >
            <span className="practice-toggle__knob" />
          </button>
        </label>
      </div>

      <div className="practice-header__stats">
        <div className="practice-header__stat-group">
          <div className="practice-header__stat">
            <i className="ti ti-book" />
            <span>{config.wordCount} slovíček</span>
          </div>
          <div className={`practice-header__stat ${config.wordsWithAudio === 0 ? 'practice-header__stat--zero' : ''}`}>
            <i className="ti ti-volume" />
            <span>{config.wordsWithAudio} s audio</span>
          </div>
          <div className={`practice-header__stat ${config.wordsWithSentences === 0 ? 'practice-header__stat--zero' : ''}`}>
            <i className="ti ti-notes" />
            <span>{config.wordsWithSentences} s větami</span>
          </div>
        </div>

        <div className="practice-header__regen">
          <span className="text-admin-xs text-admin-text-muted">
            Naposledy vygenerováno: {formatLastGenerated(config.lastGeneratedAt)}
          </span>
          <AdminButton
            variant="ghost"
            size="sm"
            icon="ti-refresh"
            loading={isRegenerating}
            onClick={onRegenerate}
          >
            Regenerovat cvičení
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
