'use client';

import { GamePreviewProps } from '@/lib/mix-editor/mix-editor.types';
import { WordTransformData } from './word-transform.types';

export default function WordTransformPreview({ data, mode }: GamePreviewProps<WordTransformData>) {
  const items = mode === 'thumbnail' ? data.items.slice(0, 2) : data.items;
  return (
    <div className="word-transform-preview">
      {items.map((item) => (
        <div key={item.id} className="word-transform-preview__row">
          <span>{item.sentence.replace('{word}', '___') || '—'}</span>
          <span className="word-transform-preview__base">({item.baseWord})</span>
        </div>
      ))}
    </div>
  );
}
