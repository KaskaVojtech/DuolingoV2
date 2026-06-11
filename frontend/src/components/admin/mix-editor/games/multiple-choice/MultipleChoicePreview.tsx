'use client';

import { GamePreviewProps } from '@/lib/mix-editor/mix-editor.types';
import { MultipleChoiceData } from './multiple-choice.types';

export default function MultipleChoicePreview({ data, mode }: GamePreviewProps<MultipleChoiceData>) {
  const questions = mode === 'thumbnail' ? data.questions.slice(0, 1) : data.questions;
  return (
    <div className="mc-preview">
      {questions.map((q) => (
        <div key={q.id} className="mc-preview__question">
          <p className="mc-preview__text">{q.question || '—'}</p>
          <div className="mc-preview__options">
            {q.options.map((o) => (
              <span key={o.id} className={`mc-preview__opt ${o.isCorrect ? 'mc-preview__opt--correct' : ''}`}>
                {o.isCorrect ? '●' : '○'} {o.text || '—'}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
