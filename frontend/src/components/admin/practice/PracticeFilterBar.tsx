'use client';

type FilterOption = 'all' | 'enabled' | 'disabled';

interface PracticeFilterBarProps {
  active: FilterOption;
  onChange: (f: FilterOption) => void;
}

const OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all',      label: 'Vše' },
  { value: 'enabled',  label: 'Aktivní' },
  { value: 'disabled', label: 'Neaktivní' },
];

export function PracticeFilterBar({ active, onChange }: PracticeFilterBarProps) {
  return (
    <div className="practice-filter-bar">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={active === opt.value ? 'practice-filter-bar__btn--active' : ''}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
