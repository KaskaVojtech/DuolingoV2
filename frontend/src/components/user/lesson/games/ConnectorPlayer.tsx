'use client';

/**
 * Interactive player of the pair-matching game.
 */

import { useEffect, useMemo, useState } from 'react';
import { GamePlayerProps, shuffle } from './game-player.types';
import { ConnectorData } from '@/components/admin/mix-editor/games/connector/connector.types';

export function ConnectorPlayer({ data, checked, onScoreChange }: GamePlayerProps<ConnectorData>) {

  const rightOptions = useMemo(() => shuffle(data.pairs.map((p) => p.right)), [data.pairs]);
  const [assign, setAssign] = useState<Record<string, string>>({});

  const results = useMemo(
    () => data.pairs.map((p) => (assign[p.id] ?? '') === p.right),
    [assign, data.pairs],
  );
  useEffect(() => {
    onScoreChange({ score: results.filter(Boolean).length, total: data.pairs.length });
  }, [results, data.pairs.length, onScoreChange]);

  return (
    <div className="flex flex-col gap-admin-sm">
      <div className="flex items-center justify-between text-admin-xs text-admin-text-muted px-1">
        <span>{data.leftLabel || ''}</span>
        <span>{data.rightLabel || ''}</span>
      </div>
      {data.pairs.map((p, i) => (
        <div
          key={p.id}
          className={`flex items-center gap-3 p-2 rounded-admin-sm border ${
            checked ? (results[i] ? 'game-answer--correct' : 'game-answer--wrong') : 'border-admin-border bg-admin-surface-2'
          }`}
        >
          <span className="flex-1 font-semibold text-admin-text border-l-2 pl-2" style={{ borderColor: p.color }}>
            {p.left || '—'}
          </span>
          <i className="ti ti-arrow-right text-admin-text-muted" />
          <select
            value={assign[p.id] ?? ''}
            onChange={(e) => setAssign((prev) => ({ ...prev, [p.id]: e.target.value }))}
            disabled={checked}
            className="admin-field !w-48"
          >
            <option value="">— vyber —</option>
            {rightOptions.map((r, ri) => (
              <option key={ri} value={r}>
                {data.rightType === 'image' ? `Obrázek ${ri + 1}` : r}
              </option>
            ))}
          </select>
          {checked && !results[i] && (
            <span className="text-admin-xs text-[#2db868] whitespace-nowrap">→ {p.right}</span>
          )}
        </div>
      ))}
    </div>
  );
}
