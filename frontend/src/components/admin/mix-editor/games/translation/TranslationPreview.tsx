'use client';

import { GamePreviewProps } from '@/lib/mix-editor/mix-editor.types';
import { TranslationData } from './translation.types';

export default function TranslationPreview({ data, mode }: GamePreviewProps<TranslationData>) {
  const items = mode === 'thumbnail' ? data.items.slice(0, 3) : data.items;
  return (
    <div className="translation-preview">
      {items.map((item) => (
        <div key={item.id} className="translation-preview__row">
          <span>{item.source || '—'}</span>
          <span className="translation-preview__blank">→ ___</span>
        </div>
      ))}
    </div>
  );
}
