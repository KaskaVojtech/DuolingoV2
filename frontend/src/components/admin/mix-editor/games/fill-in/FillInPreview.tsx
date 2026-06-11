'use client';

import { GamePreviewProps } from '@/lib/mix-editor/mix-editor.types';
import { FillInData } from './fill-in.types';

export default function FillInPreview({ data, mode }: GamePreviewProps<FillInData>) {
  const sentences = mode === 'thumbnail' ? data.sentences.slice(0, 2) : data.sentences;
  return (
    <div className="fill-in-preview">
      {sentences.map((s) => (
        <div key={s.id} className="fill-in-preview__row">
          <span>{s.sentence.replace('{blank}', '___')}</span>
          <span className="fill-in-preview__answer">→ {s.answer}</span>
        </div>
      ))}
    </div>
  );
}
