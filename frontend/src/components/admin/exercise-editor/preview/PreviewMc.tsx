'use client';

import { McComponent } from '@/lib/exercise/exercise.types';

interface Props {
  item: McComponent;
  selected: string[];
  onToggle: (optionId: string) => void;
  checked: boolean;
}

export function PreviewMc({ item, selected, onToggle, checked }: Props) {
  return (
    <div>
      <p className="text-admin-base font-medium text-admin-text mb-admin-md">{item.question}</p>
      {item.options.map((opt) => {
        const isSelected = selected.includes(opt.id);
        const resultClass = checked
          ? opt.correct && isSelected ? 'preview-result--correct' : !opt.correct && isSelected ? 'preview-result--wrong' : ''
          : '';
        return (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            className={`preview-mc-option w-full text-left ${isSelected ? 'preview-mc-option--selected' : ''} ${resultClass}`}
          >
            <span className={`w-4 h-4 rounded-${item.multiple ? 'sm' : 'full'} border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-admin-primary border-admin-primary' : 'border-admin-border'}`}>
              {isSelected && <i className="ti ti-check text-white text-[10px]" aria-hidden="true" />}
            </span>
            <span className="text-admin-sm text-admin-text">{opt.value}</span>
          </button>
        );
      })}
    </div>
  );
}
