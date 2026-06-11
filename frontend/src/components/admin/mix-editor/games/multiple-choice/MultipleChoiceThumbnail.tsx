'use client';

import { GameThumbnailProps } from '@/lib/mix-editor/mix-editor.types';
import { MultipleChoiceData } from './multiple-choice.types';

export default function MultipleChoiceThumbnail({ data }: GameThumbnailProps<MultipleChoiceData>) {
  const q = data.questions[0];
  if (!q) return <div className="game-thumbnail">—</div>;
  return (
    <div className="game-thumbnail mc-thumb">
      <p className="mc-thumb__q">{q.question.slice(0, 40) || '—'}</p>
      <div className="mc-thumb__opts">
        {q.options.slice(0, 2).map((o) => (
          <span key={o.id} className="mc-thumb__opt">{o.text.slice(0, 12) || '—'}</span>
        ))}
      </div>
    </div>
  );
}
