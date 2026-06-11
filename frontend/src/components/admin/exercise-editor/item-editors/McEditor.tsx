'use client';

import { v4 as uuid } from 'uuid';
import { McComponent } from '@/lib/exercise/exercise.types';

interface Props {
  item: McComponent;
  onChange: (updated: McComponent) => void;
}

export function McEditor({ item, onChange }: Props) {
  const addOption = () => {
    onChange({ ...item, options: [...item.options, { id: uuid(), value: '', correct: false }] });
  };

  const removeOption = (id: string) => {
    onChange({ ...item, options: item.options.filter((o) => o.id !== id) });
  };

  const toggleCorrect = (id: string) => {
    if (item.multiple) {
      onChange({ ...item, options: item.options.map((o) => o.id === id ? { ...o, correct: !o.correct } : o) });
    } else {
      onChange({ ...item, options: item.options.map((o) => ({ ...o, correct: o.id === id })) });
    }
  };

  return (
    <div className="flex flex-col gap-admin-md">
      <label className="flex flex-col gap-1">
        <span className="text-admin-xs text-admin-text-muted">Otázka</span>
        <input
          className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-md py-2 text-admin-sm text-admin-text"
          value={item.question}
          onChange={(e) => onChange({ ...item, question: e.target.value })}
          placeholder="Zadejte otázku..."
        />
      </label>

      <div>
        <p className="text-admin-xs text-admin-text-muted mb-2">Možnosti</p>
        {item.options.map((opt) => (
          <div key={opt.id} className="flex items-center gap-2 mb-2">
            <button
              onClick={() => toggleCorrect(opt.id)}
              className={`shrink-0 w-5 h-5 rounded-${item.multiple ? 'sm' : 'full'} border-2 flex items-center justify-center transition-colors ${opt.correct ? 'bg-admin-primary border-admin-primary' : 'border-admin-border'}`}
              aria-label={opt.correct ? 'Správná odpověď' : 'Označit jako správnou'}
            >
              {opt.correct && <i className="ti ti-check text-white text-[11px]" aria-hidden="true" />}
            </button>
            <input
              className="flex-1 bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-sm py-1.5 text-admin-sm text-admin-text"
              value={opt.value}
              onChange={(e) => onChange({ ...item, options: item.options.map((o) => o.id === opt.id ? { ...o, value: e.target.value } : o) })}
              placeholder={`Možnost...`}
            />
            <button onClick={() => removeOption(opt.id)} className="text-admin-text-muted hover:text-admin-danger" aria-label="Odebrat">
              <i className="ti ti-x text-[14px]" aria-hidden="true" />
            </button>
          </div>
        ))}
        <button onClick={addOption} className="text-admin-xs text-admin-primary hover:text-admin-primary-h flex items-center gap-1 mt-1">
          <i className="ti ti-plus text-[12px]" aria-hidden="true" />
          Přidat možnost
        </button>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={item.multiple}
          onChange={(e) => onChange({ ...item, multiple: e.target.checked })}
          className="accent-admin-primary"
        />
        <span className="text-admin-sm text-admin-text">Více správných odpovědí</span>
      </label>
    </div>
  );
}
