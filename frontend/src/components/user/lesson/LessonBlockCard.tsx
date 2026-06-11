'use client';

/**
 * Block card in the lesson list (type, state, lock) linking to the block detail.
 */

import Link from 'next/link';
import { UserLessonBlock } from '@/lib/user-auth/user-lesson.api';

const TYPE_META = {
  content:  { icon: 'ti-file-text', label: 'Obsah',   color: 'var(--color-block-content-primary)' },
  exercise: { icon: 'ti-pencil',    label: 'Cvičení', color: 'var(--color-block-exercise-primary)' },
  mix:      { icon: 'ti-cards',     label: 'Hry',     color: 'var(--color-block-mix-primary)' },
} as const;

const LOCK_LABEL: Record<NonNullable<UserLessonBlock['lockReason']>, string> = {
  locked: 'Zamčeno',
  scheduled_future: 'Odemkne se později',
  scheduled_past: 'Uzavřeno',
  constraint: 'Splň předchozí bloky',
};

export function LessonBlockCard({ block, href }: { block: UserLessonBlock; href: string }) {
  const meta = TYPE_META[block.type];

  const inner = (
    <>
      <div className="w-10 h-10 rounded-admin-md flex items-center justify-center shrink-0" style={{ background: meta.color }}>
        <i className={`ti ${block.isLocked ? 'ti-lock' : meta.icon} text-white text-[20px]`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-admin-base font-bold truncate ${block.isLocked ? 'text-admin-text-muted' : 'text-admin-text'}`}>
          {block.title}
        </p>
        <div className="flex items-center gap-2 text-admin-xs text-admin-text-muted mt-0.5">
          <span>{meta.label}</span>
          {block.type === 'exercise' && block.isMandatory && (
            <span className="px-1.5 py-0.5 rounded-full bg-admin-surface-2 border border-admin-border">povinné</span>
          )}
          {block.isLocked && (
            <span className="flex items-center gap-1"><i className="ti ti-lock text-[11px]" />{LOCK_LABEL[block.lockReason ?? 'locked']}</span>
          )}
        </div>
      </div>
      {block.isCompleted ? (
        <span className="flex items-center gap-1 text-admin-xs text-[#2db868] font-semibold shrink-0">
          <i className="ti ti-circle-check-filled text-[16px]" /> hotovo
        </span>
      ) : !block.isLocked ? (
        <i className="ti ti-chevron-right text-admin-text-muted text-[20px] shrink-0" />
      ) : null}
    </>
  );

  if (block.isLocked) {
    return (
      <div className="admin-card p-admin-md flex items-center gap-admin-md opacity-60 cursor-not-allowed">{inner}</div>
    );
  }

  return (
    <Link href={href} className="admin-card user-tile p-admin-md flex items-center gap-admin-md">
      {inner}
    </Link>
  );
}
