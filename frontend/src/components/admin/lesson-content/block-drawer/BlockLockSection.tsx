'use client';

import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { updateBlockConfig } from '@/lib/lesson-content/lesson-content.api';
import { Block, BlockLockMode, BlockConstraintRule } from '@/lib/lesson-content/lesson-content.types';
import { BlockConstraintDropZone } from './BlockConstraintDropZone';
import { BlockConstraintItem } from './BlockConstraintItem';
import { AdminInput } from '@/components/admin/common/AdminInput';

const LOCK_MODES: { value: BlockLockMode; label: string }[] = [
  { value: 'toggle',     label: 'Ruční' },
  { value: 'scheduled',  label: 'Časové' },
  { value: 'constraint', label: 'Podmínka' },
];

export function BlockLockSection({ block }: { block: Block }) {
  const { updateBlock } = useLessonContentStore();
  const [extraZoneKeys, setExtraZoneKeys] = useState<string[]>([]);

  const save = async (patch: Partial<Block>) => {
    updateBlock(block.id, patch);
    await updateBlockConfig(block.id, patch);
  };

  const setMode = (mode: BlockLockMode) => save({ lockConfig: { ...block.lockConfig, mode } });
  const setLocked = (isLocked: boolean) => save({ isLocked, lockConfig: { ...block.lockConfig, isLocked } });

  const addConstraintRule = (rule: BlockConstraintRule) => {
    const groups = block.lockConfig.constraintGroups;
    const updated = groups.length === 0
      ? [{ id: uuid(), rules: [rule] }]
      : [{ ...groups[0], rules: [...groups[0].rules, rule] }];
    save({ lockConfig: { ...block.lockConfig, constraintGroups: updated } });
  };

  const removeRule = (ruleId: string) => {
    const groups = block.lockConfig.constraintGroups
      .map((g) => ({ ...g, rules: g.rules.filter((r) => r.id !== ruleId) }))
      .filter((g) => g.rules.length > 0);
    save({ lockConfig: { ...block.lockConfig, constraintGroups: groups } });
  };

  const updateRuleCondition = (ruleId: string, mandatory: boolean) => {
    const groups = block.lockConfig.constraintGroups.map((g) => ({
      ...g,
      rules: g.rules.map((r) => r.id === ruleId
        ? { ...r, condition: { type: 'exercise_completed' as const, mandatory } }
        : r),
    }));
    save({ lockConfig: { ...block.lockConfig, constraintGroups: groups } });
  };

  const allRules = block.lockConfig.constraintGroups.flatMap((g) => g.rules);

  return (
    <div>
      <h3 className="text-admin-sm font-medium text-admin-text mb-admin-sm">Zamykání bloku</h3>
      <div className="flex border border-admin-border rounded-admin-sm overflow-hidden mb-admin-md">
        {LOCK_MODES.map(({ value, label }) => (
          <button key={value} onClick={() => setMode(value)} className={`flex-1 py-1.5 text-admin-xs font-medium transition-colors ${block.lockConfig.mode === value ? 'bg-admin-primary text-white' : 'bg-admin-surface-2 text-admin-text-muted hover:text-admin-text'}`}>
            {label}
          </button>
        ))}
      </div>

      {block.lockConfig.mode === 'toggle' && (
        <div className="flex border border-admin-border rounded-admin-sm overflow-hidden">
          {[true, false].map((locked) => (
            <button key={String(locked)} onClick={() => setLocked(locked)} className={`flex-1 py-2 text-admin-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${block.isLocked === locked ? 'bg-admin-primary text-white' : 'bg-admin-surface-2 text-admin-text-muted hover:text-admin-text'}`}>
              <i className={`ti ${locked ? 'ti-lock' : 'ti-lock-open'} text-[13px]`} aria-hidden="true" />
              {locked ? 'Zamčen' : 'Odemčen'}
            </button>
          ))}
        </div>
      )}

      {block.lockConfig.mode === 'scheduled' && (
        <div className="flex flex-col gap-admin-sm">
          <AdminInput label="Odemknout od" type="datetime-local" value={block.lockConfig.unlockAt ?? ''} onChange={(e) => save({ lockConfig: { ...block.lockConfig, unlockAt: e.target.value || null } })} />
          <AdminInput label="Zamknout od" type="datetime-local" value={block.lockConfig.lockAt ?? ''} onChange={(e) => save({ lockConfig: { ...block.lockConfig, lockAt: e.target.value || null } })} />
        </div>
      )}

      {block.lockConfig.mode === 'constraint' && (
        <div>
          <p className="text-admin-xs text-admin-text-muted mb-admin-sm">Blok se odemkne po splnění definovaných podmínek.</p>
          {allRules.map((rule) => (
            <BlockConstraintItem key={rule.id} rule={rule} onRemove={() => removeRule(rule.id)} onUpdateCondition={(m) => updateRuleCondition(rule.id, m)} />
          ))}
          <BlockConstraintDropZone targetBlock={block} onAdd={addConstraintRule} />
          {extraZoneKeys.map((key) => (
            <BlockConstraintDropZone
              key={key}
              targetBlock={block}
              onAdd={(rule) => {
                addConstraintRule(rule);
                setExtraZoneKeys((prev) => prev.filter((k) => k !== key));
              }}
            />
          ))}
          {allRules.length > 0 && (
            <button
              onClick={() => setExtraZoneKeys((prev) => [...prev, uuid()])}
              className="text-admin-xs text-admin-primary hover:text-admin-primary-h mt-1 flex items-center gap-1"
            >
              <i className="ti ti-plus text-[12px]" aria-hidden="true" />
              Přidat další podmínku (AND)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
