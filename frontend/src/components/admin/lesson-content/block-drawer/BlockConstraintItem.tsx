'use client';

import { BlockConstraintRule } from '@/lib/lesson-content/lesson-content.types';
import { BlockTypeBadge } from '../BlockTypeBadge';

interface BlockConstraintItemProps {
  rule: BlockConstraintRule;
  onRemove: () => void;
  onUpdateCondition: (mandatory: boolean) => void;
}

export function BlockConstraintItem({ rule, onRemove, onUpdateCondition }: BlockConstraintItemProps) {
  const isExercise = rule.sourceBlockType === 'exercise';
  const mandatory = isExercise && rule.condition.type === 'exercise_completed'
    ? (rule.condition as { type: 'exercise_completed'; mandatory: boolean }).mandatory
    : false;

  return (
    <div className={`border border-admin-border rounded-admin-sm mb-2 overflow-hidden block-constraint-item--${rule.sourceBlockType}`}>
      <div className="flex items-center gap-2 px-3 py-2 bg-admin-surface-2">
        <BlockTypeBadge type={rule.sourceBlockType} />
        <span className="flex-1 text-admin-xs text-admin-text truncate">{rule.sourceBlockTitle}</span>
        <button onClick={onRemove} className="text-admin-text-muted hover:text-admin-danger" aria-label="Odebrat podmínku">
          <i className="ti ti-x text-[14px]" aria-hidden="true" />
        </button>
      </div>
      <div className="px-3 py-2 border-t border-admin-border">
        <p className="text-admin-xs text-admin-text-muted mb-1.5">Podmínka:</p>
        {!isExercise ? (
          <p className="text-admin-xs text-admin-text flex items-center gap-1">
            <i className="ti ti-check text-[#2db868]" aria-hidden="true" />
            Označen jako přečtený
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {[false, true].map((m) => (
              <label key={String(m)} className="flex items-center gap-2 text-admin-xs text-admin-text cursor-pointer">
                <input
                  type="radio"
                  name={`block-mandatory-${rule.id}`}
                  checked={mandatory === m}
                  onChange={() => onUpdateCondition(m)}
                  className="accent-admin-primary"
                />
                {m ? 'Splněno (pouze povinné)' : 'Splněno (povinné i nepovinné)'}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
