'use client';

import { GamePreviewProps } from '@/lib/mix-editor/mix-editor.types';
import { ListeningData } from './listening.types';

export default function ListeningPreview({ data, mode }: GamePreviewProps<ListeningData>) {
  const questions = mode === 'thumbnail' ? data.questions.slice(0, 1) : data.questions;
  return (
    <div className="listening-preview">
      {questions.map((q) => (
        <div key={q.id} className="listening-preview__q">
          <div className="listening-preview__audio">
            <i className="ti ti-volume" /> ─────────
          </div>
          <p>{q.question}</p>
          <div className="listening-preview__options">
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
