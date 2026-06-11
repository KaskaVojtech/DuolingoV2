'use client';

import { HighlightComponent } from '@/lib/exercise/exercise.types';

interface Props {
  item: HighlightComponent;
  selected: string[];
  onToggle: (wordValue: string) => void;
  checked: boolean;
}

export function PreviewHighlight({ item, selected, onToggle, checked }: Props) {
  return (
    <div>
      {item.instruction && <p className="text-admin-sm text-admin-text-muted mb-admin-md">{item.instruction}</p>}
      <div className="flex flex-wrap gap-2">
        {item.content.map((node, idx) => {
          if (node.type === 'text') return <span key={idx}>{node.value}</span>;
          const isSelected = selected.includes(node.value);
          const resultClass = checked
            ? node.correct && isSelected ? 'preview-result--correct' : !node.correct && isSelected ? 'preview-result--wrong' : ''
            : '';
          return (
            <button
              key={idx}
              onClick={() => onToggle(node.value)}
              className={`preview-highlight-word ${isSelected ? 'preview-highlight-word--selected' : ''} ${resultClass}`}
            >
              {node.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
