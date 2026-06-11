'use client';

import { GameThumbnailProps } from '@/lib/mix-editor/mix-editor.types';
import { TranslationData } from './translation.types';

export default function TranslationThumbnail({ data }: GameThumbnailProps<TranslationData>) {
  return (
    <div className="game-thumbnail translation-thumb">
      {data.items.slice(0, 3).map((item) => (
        <div key={item.id} className="translation-thumb__row">
          {item.source.slice(0, 12) || '—'} → ___
        </div>
      ))}
    </div>
  );
}
