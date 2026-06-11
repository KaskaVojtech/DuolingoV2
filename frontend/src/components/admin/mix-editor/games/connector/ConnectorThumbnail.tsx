'use client';

import { GameThumbnailProps } from '@/lib/mix-editor/mix-editor.types';
import { ConnectorData } from './connector.types';

export default function ConnectorThumbnail({ data }: GameThumbnailProps<ConnectorData>) {
  return (
    <div className="game-thumbnail connector-thumb">
      {data.pairs.slice(0, 5).map((pair) => (
        <div key={pair.id} className="connector-thumb__row">
          <span style={{ background: pair.color }} className="connector-thumb__chip">{pair.left || '?'}</span>
          <span style={{ background: pair.color }} className="connector-thumb__chip">{pair.right || '?'}</span>
        </div>
      ))}
    </div>
  );
}
