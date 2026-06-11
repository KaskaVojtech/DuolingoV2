'use client';

import { GameThumbnailProps } from '@/lib/mix-editor/mix-editor.types';
import { ListeningData } from './listening.types';

export default function ListeningThumbnail({ data }: GameThumbnailProps<ListeningData>) {
  return (
    <div className="game-thumbnail listening-thumb">
      <div className="listening-thumb__icon"><i className="ti ti-volume" /></div>
      <p className="listening-thumb__count">{data.questions.length} otázek</p>
    </div>
  );
}
