'use client';

import { GameThumbnailProps } from '@/lib/mix-editor/mix-editor.types';
import { WordTransformData } from './word-transform.types';

export default function WordTransformThumbnail({ data }: GameThumbnailProps<WordTransformData>) {
  return (
    <div className="game-thumbnail word-transform-thumb">
      {data.items.slice(0, 2).map((item) => (
        <div key={item.id} className="word-transform-thumb__row">
          {item.sentence.replace('{word}', '___').slice(0, 25) || '—'} ({item.baseWord})
        </div>
      ))}
    </div>
  );
}
