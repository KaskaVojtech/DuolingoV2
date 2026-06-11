'use client';

import { GamePreviewProps } from '@/lib/mix-editor/mix-editor.types';
import { ConnectorData } from './connector.types';

export default function ConnectorPreview({ data, mode }: GamePreviewProps<ConnectorData>) {
  const pairs = mode === 'thumbnail' ? data.pairs.slice(0, 3) : data.pairs;
  return (
    <div className="connector-preview">
      {pairs.map((pair) => (
        <div key={pair.id} className="connector-preview__row">
          <span className="connector-preview__cell" style={{ borderLeftColor: pair.color }}>
            {pair.left || '—'}
          </span>
          <span className="connector-preview__arrow">→</span>
          <span className="connector-preview__cell" style={{ borderLeftColor: pair.color }}>
            {pair.right || '—'}
          </span>
        </div>
      ))}
    </div>
  );
}
