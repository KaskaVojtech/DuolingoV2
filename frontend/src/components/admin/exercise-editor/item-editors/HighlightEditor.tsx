'use client';

import { useState, useEffect } from 'react';
import { HighlightComponent, HighlightNode } from '@/lib/exercise/exercise.types';

interface Props {
  item: HighlightComponent;
  onChange: (updated: HighlightComponent) => void;
}

function parseTextToNodes(text: string): HighlightNode[] {
  return text.split(/\s+/).filter(Boolean).map((word) => ({ type: 'word' as const, value: word, correct: false }));
}

export function HighlightEditor({ item, onChange }: Props) {

  const [rawText, setRawText] = useState(() => item.content.map((n) => n.value).join(' '));

  useEffect(() => {
    setRawText(item.content.map((n) => n.value).join(' '));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const handleTextBlur = () => {
    const nodes = parseTextToNodes(rawText);
    if (nodes.length > 0) {
      onChange({ ...item, content: nodes });
    }
  };

  const toggleWord = (idx: number) => {
    const content = item.content.map((n, i) => {
      if (i !== idx || n.type !== 'word') return n;
      return { ...n, correct: !n.correct };
    });
    onChange({ ...item, content });
  };

  const hasWords = item.content.some((n) => n.type === 'word');

  return (
    <div className="flex flex-col gap-admin-md">
      <label className="flex flex-col gap-1">
        <span className="text-admin-xs text-admin-text-muted">Instrukce</span>
        <input
          className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-md py-2 text-admin-sm text-admin-text"
          value={item.instruction ?? ''}
          onChange={(e) => onChange({ ...item, instruction: e.target.value })}
          placeholder="Kliknutím označte správná slova..."
        />
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={item.multiple}
          onChange={(e) => onChange({ ...item, multiple: e.target.checked })}
          className="accent-admin-primary"
        />
        <span className="text-admin-sm text-admin-text">Vybrat více slov</span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-admin-xs text-admin-text-muted">Text (slova oddělená mezerou)</span>
        <textarea
          className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-md py-2 text-admin-sm text-admin-text resize-none"
          rows={3}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          onBlur={handleTextBlur}
          placeholder="Zadejte text cvičení..."
        />
      </label>

      {hasWords && (
        <div>
          <p className="text-admin-xs text-admin-text-muted mb-2">Klikněte na slova pro označení správných:</p>
          <div className="flex flex-wrap gap-2">
            {item.content.map((node, idx) => {
              if (node.type !== 'word') return null;
              return (
                <button
                  key={idx}
                  onClick={() => toggleWord(idx)}
                  className={`px-3 py-1 rounded text-admin-sm border transition-colors ${node.correct
                    ? 'bg-block-exercise-bg border-block-exercise-border text-block-exercise-primary'
                    : 'bg-admin-surface-2 border-admin-border text-admin-text-muted hover:text-admin-text'
                  }`}
                >
                  {node.value}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
