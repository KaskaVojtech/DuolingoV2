'use client';

import { GameThumbnailProps } from '@/lib/mix-editor/mix-editor.types';
import { WordOrderData } from './word-order.types';

export default function WordOrderThumbnail({ data }: GameThumbnailProps<WordOrderData>) {
  const first = data.sentences[0];
  return (
    <div className="game-thumbnail word-order-thumb">
      {first ? (
        <div className="word-order-thumb__chips">
          {[...first.words].reverse().slice(0, 4).map((w, i) => (
            <span key={i} className="word-order-row__chip">{w}</span>
          ))}
        </div>
      ) : (
        <span>—</span>
      )}
    </div>
  );
}
