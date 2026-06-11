'use client';

import { GameThumbnailProps } from '@/lib/mix-editor/mix-editor.types';
import { FillInData } from './fill-in.types';

export default function FillInThumbnail({ data }: GameThumbnailProps<FillInData>) {
  return (
    <div className="game-thumbnail fill-in-thumb">
      {data.sentences.slice(0, 3).map((s) => (
        <div key={s.id} className="fill-in-thumb__row">
          <span>{s.sentence.replace('{blank}', '___').slice(0, 30)}</span>
        </div>
      ))}
    </div>
  );
}
