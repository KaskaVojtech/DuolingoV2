'use client';

import { AnswerComponent } from '@/lib/exercise/exercise.types';

interface Props { item: AnswerComponent; onChange: (updated: AnswerComponent) => void; }

export function AnswerEditor({ item, onChange }: Props) {
  return (
    <div className="flex flex-col gap-admin-md">
      <div>
        <p className="text-admin-xs text-admin-text-muted mb-2">Délka odpovědi</p>
        <div className="flex gap-admin-md">
          {(['short', 'long'] as const).map((len) => (
            <label key={len} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`answer-length-${item.id}`}
                checked={item.length === len}
                onChange={() => onChange({ ...item, length: len })}
                className="accent-admin-primary"
              />
              <span className="text-admin-sm text-admin-text">{len === 'short' ? 'Krátká' : 'Dlouhá'}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-admin-xs text-admin-text-muted mb-2">Hodnocení</p>
        <div className="flex gap-admin-md">
          {(['auto', 'teacher'] as const).map((ev) => (
            <label key={ev} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`answer-eval-${item.id}`}
                checked={item.evaluation === ev}
                onChange={() => onChange({ ...item, evaluation: ev })}
                className="accent-admin-primary"
              />
              <span className="text-admin-sm text-admin-text">{ev === 'auto' ? 'Automatické' : 'Učitel'}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-admin-xs text-admin-text-muted">Placeholder (volitelný)</span>
        <input
          className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-md py-2 text-admin-sm text-admin-text"
          value={item.placeholder ?? ''}
          onChange={(e) => onChange({ ...item, placeholder: e.target.value })}
          placeholder="Napište svoji odpověď..."
        />
      </label>
    </div>
  );
}
