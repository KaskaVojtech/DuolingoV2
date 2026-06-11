'use client';

import { GamePreviewProps } from '@/lib/mix-editor/mix-editor.types';
import { WordOrderData } from './word-order.types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WordOrderPreview({ data, mode }: GamePreviewProps<WordOrderData>) {
  const sentences = mode === 'thumbnail' ? data.sentences.slice(0, 1) : data.sentences;
  return (
    <div className="word-order-preview">
      {sentences.map((s) => (
        <div key={s.id} className="word-order-preview__row">
          <div className="word-order-preview__chips">
            {shuffle([...s.words]).map((w, i) => (
              <span key={i} className="word-order-row__chip">{w}</span>
            ))}
          </div>
          <p className="word-order-preview__answer">→ {s.words.join(' ')}</p>
        </div>
      ))}
    </div>
  );
}
