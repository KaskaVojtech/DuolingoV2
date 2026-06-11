'use client';

import { PracticeCategory as PracticeCategoryType, CATEGORY_LABELS, PRACTICE_CATEGORY, PracticeTypeConfig } from '@/lib/practice/practice.types';
import { PracticeTypeCard } from './PracticeTypeCard';

interface PracticeCategoryProps {
  category: PracticeCategoryType;
  types: PracticeTypeConfig[];
  activeFilter: 'all' | 'enabled' | 'disabled';
  isPracticeEnabled: boolean;
  onToggleType: (type: PracticeTypeConfig['type'], enabled: boolean) => void;
}

export function PracticeCategory({ category, types, activeFilter, isPracticeEnabled, onToggleType }: PracticeCategoryProps) {
  const categoryTypes = types.filter((t) => PRACTICE_CATEGORY[t.type] === category);

  const visibleTypes = categoryTypes.filter((t) => {
    if (activeFilter === 'enabled') return t.isEnabled;
    if (activeFilter === 'disabled') return !t.isEnabled;
    return true;
  });

  if (visibleTypes.length === 0) return null;

  return (
    <div className="practice-category">
      <h2 className="practice-category__title">{CATEGORY_LABELS[category]}</h2>
      <div className="practice-category__grid">
        {visibleTypes.map((config) => (
          <PracticeTypeCard
            key={config.type}
            config={config}
            onToggle={(enabled) => onToggleType(config.type, enabled)}
            isPracticeEnabled={isPracticeEnabled}
          />
        ))}
      </div>
    </div>
  );
}
