import { PartOfSpeech, POS_LABELS } from '@/lib/vocabulary/vocabulary.types';

const POS_COLORS: Record<PartOfSpeech, { bg: string; color: string }> = {
  noun:         { bg: 'rgba(91,124,250,0.12)',   color: '#5b7cfa' },
  verb:         { bg: 'rgba(34,199,154,0.12)',   color: '#22c79a' },
  adjective:    { bg: 'rgba(168,85,247,0.12)',   color: '#a855f7' },
  adverb:       { bg: 'rgba(45,184,104,0.12)',   color: '#2db868' },
  preposition:  { bg: 'rgba(217,70,239,0.12)',   color: '#d946ef' },
  conjunction:  { bg: 'rgba(99,102,241,0.12)',   color: '#6366f1' },
  pronoun:      { bg: 'rgba(255,95,162,0.14)',   color: '#ff5fa2' },
  interjection: { bg: 'rgba(63,107,245,0.12)',   color: '#3f6bf5' },
  phrase:       { bg: 'rgba(140,145,189,0.14)',  color: '#8c91bd' },
};

export function PosBadge({ pos }: { pos: PartOfSpeech }) {
  const { bg, color } = POS_COLORS[pos];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap"
      style={{ background: bg, color, border: `1px solid ${color}44` }}
    >
      {POS_LABELS[pos]}
    </span>
  );
}
