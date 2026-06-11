'use client';

import { useState } from 'react';
import { InputComponent } from '@/lib/exercise/exercise.types';

interface Props {
  node: InputComponent;
  onChange: (updated: InputComponent) => void;
  onDelete: () => void;
}

export function InlineInputNode({ node, onChange, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <span className="inline-flex items-center gap-1">
      <button
        className="inline-component-chip inline-component-chip--input"
        onClick={() => setOpen(!open)}
        title="Editovat input"
      >
        <i className="ti ti-text-size text-[11px]" aria-hidden="true" />
        {node.correct || 'input'}
      </button>
      <button onClick={onDelete} className="text-admin-text-muted hover:text-admin-danger text-[10px]" aria-label="Smazat">
        <i className="ti ti-x" aria-hidden="true" />
      </button>
      {open && (
        <span className="absolute z-50 mt-1 bg-admin-surface border border-admin-border rounded-admin-md p-admin-sm flex flex-col gap-2 shadow-lg min-w-[200px]">
          <label className="flex flex-col gap-1">
            <span className="text-admin-xs text-admin-text-muted">Správná odpověď</span>
            <input
              className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text"
              value={node.correct}
              onChange={(e) => onChange({ ...node, correct: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-admin-xs text-admin-text-muted">Akceptovat také (čárkou)</span>
            <input
              className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text"
              value={(node.acceptAlso ?? []).join(', ')}
              onChange={(e) => onChange({ ...node, acceptAlso: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-admin-xs text-admin-text-muted">Nápověda</span>
            <input
              className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text"
              value={node.hint ?? ''}
              onChange={(e) => onChange({ ...node, hint: e.target.value || undefined })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-admin-xs text-admin-text-muted">Hodnocení</span>
            <select
              className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text"
              value={node.evaluation}
              onChange={(e) => onChange({ ...node, evaluation: e.target.value as 'auto' | 'teacher' })}
            >
              <option value="auto">Automatické</option>
              <option value="teacher">Učitel</option>
            </select>
          </label>
          <button onClick={() => setOpen(false)} className="text-admin-xs text-admin-primary mt-1">Zavřít</button>
        </span>
      )}
    </span>
  );
}
