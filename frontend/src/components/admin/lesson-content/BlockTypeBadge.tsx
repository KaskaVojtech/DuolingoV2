import { BlockType } from '@/lib/lesson-content/lesson-content.types';

const BADGE: Record<BlockType, { label: string; bg: string; border: string; color: string }> = {
  content:  { label: 'Obsah',    bg: 'var(--color-block-content-bg)',  border: 'var(--color-block-content-border)',  color: 'var(--color-block-content-primary)'  },
  exercise: { label: 'Cvičení',  bg: 'var(--color-block-exercise-bg)', border: 'var(--color-block-exercise-border)', color: 'var(--color-block-exercise-primary)' },
  mix:      { label: 'Mix her',  bg: 'var(--color-block-mix-bg)',      border: 'var(--color-block-mix-border)',      color: 'var(--color-block-mix-primary)'      },
};

export function BlockTypeBadge({ type }: { type: BlockType }) {
  const b = BADGE[type] ?? BADGE.exercise;
  return (
    <span
      className="text-admin-xs font-medium"
      style={{ background: b.bg, border: `1px solid ${b.border}`, color: b.color, borderRadius: 999, padding: '2px 10px', display: 'inline-block' }}
    >
      {b.label}
    </span>
  );
}
