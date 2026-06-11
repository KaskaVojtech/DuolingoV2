'use client';

import { DragAndDropComponent } from '@/lib/exercise/exercise.types';

interface Props {
  item: DragAndDropComponent;
  onChange: (updated: DragAndDropComponent) => void;
}

export function DragAndDropEditor({ item, onChange }: Props) {
  const { source, targets } = item;

  const addWord = () => {
    onChange({ ...item, source: { ...source, words: [...source.words, ''] } });
  };

  const removeWord = (idx: number) => {
    onChange({ ...item, source: { ...source, words: source.words.filter((_, i) => i !== idx) } });
  };

  const updateWord = (idx: number, value: string) => {
    onChange({ ...item, source: { ...source, words: source.words.map((w, i) => i === idx ? value : w) } });
  };

  return (
    <div className="flex flex-col gap-admin-md">
      <div>
        <p className="text-admin-xs text-admin-text-muted mb-2">Slova ke přetahování</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {source.words.map((word, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <input
                className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text"
                style={{ width: Math.max(60, word.length * 8 + 20) }}
                value={word}
                onChange={(e) => updateWord(idx, e.target.value)}
                placeholder="slovo"
              />
              <button onClick={() => removeWord(idx)} className="text-admin-text-muted hover:text-admin-danger" aria-label="Odebrat">
                <i className="ti ti-x text-[12px]" aria-hidden="true" />
              </button>
            </div>
          ))}
          <button onClick={addWord} className="text-admin-xs text-admin-primary flex items-center gap-1 px-2 py-1 border border-dashed border-admin-border rounded">
            <i className="ti ti-plus text-[12px]" aria-hidden="true" />
            Přidat slovo
          </button>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={source.allowReuse}
            onChange={(e) => onChange({ ...item, source: { ...source, allowReuse: e.target.checked } })}
            className="accent-admin-primary"
          />
          <span className="text-admin-sm text-admin-text">Slova lze použít vícekrát</span>
        </label>
      </div>

      {targets.length > 0 && (
        <div>
          <p className="text-admin-xs text-admin-text-muted mb-2">Cíle (přidejte je v textu pomocí &quot;+ Drag target&quot;)</p>
          <div className="flex flex-col gap-2">
            {targets.map((target, idx) => (
              <div key={target.id} className="flex items-center gap-2">
                <span className="text-admin-xs text-admin-text-muted w-20">Cíl {idx + 1}</span>
                <input
                  className="flex-1 bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-xs text-admin-text"
                  value={target.correct}
                  onChange={(e) => {
                    const updated = item.targets.map((t) => t.id === target.id ? { ...t, correct: e.target.value } : t);
                    onChange({ ...item, targets: updated });
                  }}
                  placeholder="Správná odpověď..."
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {targets.length === 0 && (
        <p className="text-admin-xs text-admin-text-muted italic">
          Přidejte cíle přes „+ Drag target" v editoru textu.
        </p>
      )}
    </div>
  );
}
