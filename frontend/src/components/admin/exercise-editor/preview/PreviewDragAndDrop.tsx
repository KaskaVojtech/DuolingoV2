'use client';

import { useState } from 'react';
import { DragAndDropComponent } from '@/lib/exercise/exercise.types';

interface Props {
  item: DragAndDropComponent;
  answers: Record<string, string>;
  onAnswer: (targetId: string, word: string) => void;
  checked: boolean;
}

export function PreviewDragAndDrop({ item, answers, onAnswer, checked }: Props) {

  const [selected, setSelected] = useState<string | null>(null);

  const usedWords = Object.values(answers);
  const availableWords = item.source.allowReuse
    ? item.source.words
    : item.source.words.filter((w) => !usedWords.includes(w));

  const handleWordClick = (word: string) => {
    setSelected((prev) => (prev === word ? null : word));
  };

  const handleTargetClick = (targetId: string) => {
    const filled = answers[targetId];
    if (selected) {
      onAnswer(targetId, selected);
      setSelected(null);
    } else if (filled) {

      onAnswer(targetId, '');
    }
  };

  return (
    <div>

      <div className="preview-drag-source">
        {availableWords.map((word, idx) => (
          <button
            key={idx}
            type="button"
            className={`preview-drag-word ${selected === word ? 'preview-drag-word--selected' : ''}`}
            onClick={() => handleWordClick(word)}

            onMouseDown={(e) => e.preventDefault()}
          >
            {word}
          </button>
        ))}
        {availableWords.length === 0 && (
          <span className="text-admin-xs text-admin-text-muted italic">Všechna slova jsou použita</span>
        )}
      </div>

      {selected && (
        <p className="text-admin-xs text-admin-text-muted mt-2">
          Klikněte na cíl pro vložení slova <strong>{selected}</strong>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-admin-md">
        {item.targets.map((target, idx) => {
          const filled = answers[target.id];
          const isCorrect = filled === target.correct;
          return (
            <span key={target.id} className="inline-flex items-center gap-1">
              <span className="text-admin-xs text-admin-text-muted">{idx + 1}.</span>
              <button
                type="button"
                className={`preview-drag-target ${filled ? 'preview-drag-target--filled' : ''} ${selected ? 'preview-drag-target--ready' : ''} ${checked && filled ? isCorrect ? 'preview-result--correct' : 'preview-result--wrong' : ''}`}
                onClick={() => handleTargetClick(target.id)}
                title={filled ? 'Kliknutím odeberete' : 'Kliknutím vložíte vybrané slovo'}
              >
                {filled || '      '}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
