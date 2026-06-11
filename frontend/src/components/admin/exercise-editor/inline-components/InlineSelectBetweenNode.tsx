'use client';

import { useState } from 'react';
import { SelectBetweenComponent } from '@/lib/exercise/exercise.types';

interface Props {
  node: SelectBetweenComponent;
  onChange: (updated: SelectBetweenComponent) => void;
  onDelete: () => void;
}

export function InlineSelectBetweenNode({ node, onChange, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <span className="inline-flex items-center gap-1 relative">
      <button
        className="inline-component-chip inline-component-chip--select_between"
        onClick={() => setOpen(!open)}
        title="Editovat select between"
      >
        <i className="ti ti-arrows-left-right text-[11px]" aria-hidden="true" />
        {node.options.join(' / ')}
      </button>
      <button onClick={onDelete} className="text-admin-text-muted hover:text-admin-danger text-[10px]" aria-label="Smazat">
        <i className="ti ti-x" aria-hidden="true" />
      </button>
      {open && (
        <span className="absolute top-full left-0 z-50 mt-1 bg-admin-surface border border-admin-border rounded-admin-md p-admin-sm flex flex-col gap-2 shadow-lg min-w-[220px]">
          <label className="flex flex-col gap-1">
            <span className="text-admin-xs text-admin-text-muted">Možnosti (čárkou)</span>
            <input
              className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text"
              value={node.options.join(', ')}
              onChange={(e) => onChange({ ...node, options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-admin-xs text-admin-text-muted">Správná odpověď</span>
            <select
              className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text"
              value={node.correct}
              onChange={(e) => onChange({ ...node, correct: e.target.value })}
            >
              {node.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <button onClick={() => setOpen(false)} className="text-admin-xs text-admin-primary mt-1">Zavřít</button>
        </span>
      )}
    </span>
  );
}
