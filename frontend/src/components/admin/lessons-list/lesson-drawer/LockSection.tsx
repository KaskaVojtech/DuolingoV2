'use client';

import { v4 as uuid } from 'uuid';
import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';
import { updateLessonConfig } from '@/lib/lessons-list/lessons-list.api';
import { Lesson, LockMode, ConstraintRule } from '@/lib/lessons-list/lessons-list.types';
import { ConstraintDropZone } from './ConstraintDropZone';
import { ConstraintItem } from './ConstraintItem';
import { AdminInput } from '@/components/admin/common/AdminInput';

interface LockSectionProps { lesson: Lesson; }

const LOCK_MODES: { value: LockMode; label: string }[] = [
  { value: 'toggle',     label: 'Ruční' },
  { value: 'scheduled',  label: 'Časové' },
  { value: 'constraint', label: 'Podmínka' },
];

export function LockSection({ lesson }: LockSectionProps) {
  const { updateLesson } = useLessonsListStore();

  const save = async (patch: Partial<Lesson>) => {
    updateLesson(lesson.id, patch);
    await updateLessonConfig(lesson.id, patch);
  };

  const setMode = (mode: LockMode) =>
    save({ lockConfig: { ...lesson.lockConfig, mode } });

  const setLocked = (isLocked: boolean) =>
    save({ isLocked, lockConfig: { ...lesson.lockConfig, isLocked } });

  const addConstraint = (sourceLessonId: string, sourceLessonTitle: string) => {
    const groups = lesson.lockConfig.constraintGroups;
    const newRule: ConstraintRule = { id: uuid(), sourceLessonId, sourceLessonTitle, threshold: 'full' };
    const updated = groups.length === 0
      ? [{ id: uuid(), rules: [newRule] }]
      : [{ ...groups[0], rules: [...groups[0].rules, newRule] }];
    save({ lockConfig: { ...lesson.lockConfig, constraintGroups: updated } });
  };

  const removeConstraint = (ruleId: string) => {
    const groups = lesson.lockConfig.constraintGroups.map((g) => ({
      ...g,
      rules: g.rules.filter((r) => r.id !== ruleId),
    })).filter((g) => g.rules.length > 0);
    save({ lockConfig: { ...lesson.lockConfig, constraintGroups: groups } });
  };

  const updateRule = (ruleId: string, threshold: 'full' | 'partial', partialCount?: number) => {
    const groups = lesson.lockConfig.constraintGroups.map((g) => ({
      ...g,
      rules: g.rules.map((r) => r.id === ruleId ? { ...r, threshold, partialCount } : r),
    }));
    save({ lockConfig: { ...lesson.lockConfig, constraintGroups: groups } });
  };

  const allRules = lesson.lockConfig.constraintGroups.flatMap((g) => g.rules);

  return (
    <div>
      <h3 className="text-admin-sm font-medium text-admin-text mb-admin-sm">Zamykání lekce</h3>

      <div className="flex border border-admin-border rounded-admin-sm overflow-hidden mb-admin-md">
        {LOCK_MODES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={`flex-1 py-1.5 text-admin-xs font-medium transition-colors ${
              lesson.lockConfig.mode === value
                ? 'bg-admin-primary text-white'
                : 'bg-admin-surface-2 text-admin-text-muted hover:text-admin-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {lesson.lockConfig.mode === 'toggle' && (
        <div className="flex border border-admin-border rounded-admin-sm overflow-hidden">
          {[true, false].map((locked) => (
            <button
              key={String(locked)}
              onClick={() => setLocked(locked)}
              className={`flex-1 py-2 text-admin-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                lesson.isLocked === locked
                  ? 'bg-admin-primary text-white'
                  : 'bg-admin-surface-2 text-admin-text-muted hover:text-admin-text'
              }`}
            >
              <i className={`ti ${locked ? 'ti-lock' : 'ti-lock-open'} text-[13px]`} aria-hidden="true" />
              {locked ? 'Zamčena' : 'Odemčena'}
            </button>
          ))}
        </div>
      )}

      {lesson.lockConfig.mode === 'scheduled' && (
        <div className="flex flex-col gap-admin-sm">
          <AdminInput
            label="Odemknout od"
            type="datetime-local"
            value={lesson.lockConfig.unlockAt ?? ''}
            onChange={(e) => save({ lockConfig: { ...lesson.lockConfig, unlockAt: e.target.value || null } })}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <AdminInput
            label="Zamknout od"
            type="datetime-local"
            value={lesson.lockConfig.lockAt ?? ''}
            onChange={(e) => save({ lockConfig: { ...lesson.lockConfig, lockAt: e.target.value || null } })}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {lesson.lockConfig.mode === 'constraint' && (
        <div>
          <p className="text-admin-xs text-admin-text-muted mb-admin-sm">
            Lekce se odemkne, jakmile uživatel splní definované podmínky.
          </p>
          {allRules.map((rule) => (
            <ConstraintItem
              key={rule.id}
              rule={rule}
              lessonBlocksCount={lesson.blocksCount}
              onRemove={() => removeConstraint(rule.id)}
              onUpdateThreshold={(threshold, partialCount) => updateRule(rule.id, threshold, partialCount)}
            />
          ))}
          <ConstraintDropZone targetLesson={lesson} onAdd={addConstraint} />
        </div>
      )}
    </div>
  );
}
