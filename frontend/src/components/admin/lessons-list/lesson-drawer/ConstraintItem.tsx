'use client';

import { ConstraintRule } from '@/lib/lessons-list/lessons-list.types';

interface ConstraintItemProps {
  rule: ConstraintRule;
  lessonBlocksCount: number;
  onRemove: () => void;
  onUpdateThreshold: (threshold: 'full' | 'partial', partialCount?: number) => void;
}

export function ConstraintItem({ rule, lessonBlocksCount, onRemove, onUpdateThreshold }: ConstraintItemProps) {
  return (
    <div className="border border-admin-border rounded-admin-sm mb-2 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-admin-surface-2">
        <i className="ti ti-file text-[14px] text-admin-text-muted" aria-hidden="true" />
        <span className="flex-1 text-admin-xs text-admin-text truncate">{rule.sourceLessonTitle}</span>
        <button
          onClick={onRemove}
          className="text-admin-text-muted hover:text-admin-danger transition-colors"
          aria-label="Odebrat podmínku"
        >
          <i className="ti ti-x text-[14px]" aria-hidden="true" />
        </button>
      </div>
      <div className="px-3 py-2 border-t border-admin-border">
        <p className="text-admin-xs text-admin-text-muted mb-1.5">Práh splnění:</p>
        <label className="flex items-center gap-2 text-admin-xs text-admin-text mb-1 cursor-pointer">
          <input
            type="radio"
            name={`threshold-${rule.id}`}
            checked={rule.threshold === 'full'}
            onChange={() => onUpdateThreshold('full')}
            className="accent-admin-primary"
          />
          Plné splnění (100%)
        </label>
        <label className="flex items-center gap-2 text-admin-xs text-admin-text cursor-pointer">
          <input
            type="radio"
            name={`threshold-${rule.id}`}
            checked={rule.threshold === 'partial'}
            onChange={() => onUpdateThreshold('partial', rule.partialCount ?? 1)}
            className="accent-admin-primary"
          />
          Částečné splnění
          {rule.threshold === 'partial' && (
            <input
              type="number"
              min={1}
              max={lessonBlocksCount}
              value={rule.partialCount ?? 1}
              onChange={(e) => onUpdateThreshold('partial', Number(e.target.value))}
              className="w-14 bg-admin-surface border border-admin-border rounded px-1.5 py-0.5 text-admin-xs text-admin-text focus:outline-none"
            />
          )}
          {rule.threshold === 'partial' && <span className="text-admin-text-muted">bloků</span>}
        </label>
      </div>
    </div>
  );
}
