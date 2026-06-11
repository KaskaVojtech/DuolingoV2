'use client';

import { useState } from 'react';
import { DragTargetComponent, DragAndDropComponent } from '@/lib/exercise/exercise.types';

interface Props {
  node: DragTargetComponent;
  dragSources: DragAndDropComponent[];
  onChange: (updated: DragTargetComponent) => void;
  onDelete: () => void;
}

export function InlineDragTargetNode({ node, dragSources, onChange, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <span className="inline-flex items-center gap-1 relative">
      <button
        className="inline-component-chip inline-component-chip--drag_target"
        onClick={() => setOpen(!open)}
        title="Editovat drag target"
      >
        <i className="ti ti-target text-[11px]" aria-hidden="true" />
        {node.correct || '[cíl]'}
      </button>
      <button onClick={onDelete} className="text-admin-text-muted hover:text-admin-danger text-[10px]" aria-label="Smazat">
        <i className="ti ti-x" aria-hidden="true" />
      </button>
      {open && (
        <span className="absolute top-full left-0 z-50 mt-1 bg-admin-surface border border-admin-border rounded-admin-md p-admin-sm flex flex-col gap-2 shadow-lg min-w-[220px]">
          <label className="flex flex-col gap-1">
            <span className="text-admin-xs text-admin-text-muted">Správná odpověď</span>
            <input
              className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text"
              value={node.correct}
              onChange={(e) => onChange({ ...node, correct: e.target.value })}
            />
          </label>
          {dragSources.length > 0 && (
            <label className="flex flex-col gap-1">
              <span className="text-admin-xs text-admin-text-muted">Zdroj slov</span>
              <select
                className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text"
                value={node.sourceId}
                onChange={(e) => onChange({ ...node, sourceId: e.target.value })}
              >
                {dragSources.map((ds) => (
                  <option key={ds.source.id} value={ds.source.id}>
                    {ds.source.words.join(', ') || `Zdroj ${ds.id.slice(0, 6)}`}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button onClick={() => setOpen(false)} className="text-admin-xs text-admin-primary mt-1">Zavřít</button>
        </span>
      )}
    </span>
  );
}
