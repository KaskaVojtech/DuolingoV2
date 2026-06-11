import { ConstraintImpact } from '@/lib/lessons-list/lessons-list.types';

interface DeleteLessonConstraintListProps {
  impacts: ConstraintImpact[];
}

export function DeleteLessonConstraintList({ impacts }: DeleteLessonConstraintListProps) {
  if (impacts.length === 0) return null;

  return (
    <div className="mb-admin-md">
      <p className="text-admin-sm text-admin-text-muted mb-admin-sm">
        Tato lekce je podmínkou pro jiné lekce. Smazáním dojde k těmto změnám:
      </p>
      <div className="flex flex-col gap-1">
        {impacts.map((impact) => (
          <div key={impact.constraintRuleId} className="flex items-start gap-2 text-admin-xs">
            {impact.isAutoResolvable ? (
              <i className="ti ti-check text-[#2db868] mt-0.5 shrink-0" aria-hidden="true" />
            ) : (
              <i className="ti ti-x text-admin-danger mt-0.5 shrink-0" aria-hidden="true" />
            )}
            <span className={impact.isAutoResolvable ? 'text-admin-text' : 'text-admin-text-muted'}>
              Lekce &ldquo;{impact.affectedLessonTitle}&rdquo; —{' '}
              {impact.isAutoResolvable
                ? impact.autoResolveDescription
                : 'podmínka bude odstraněna'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
