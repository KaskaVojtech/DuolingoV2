import { lazy } from 'react';
import { v4 as uuid } from 'uuid';
import { GamePlugin } from '@/lib/mix-editor/mix-editor.types';
import { ConnectorData } from './connector.types';
import { autoGenerateConnector } from './connector.generator';

export const ConnectorPlugin: GamePlugin<ConnectorData> = {
  type: 'connector',
  label: 'Spojovačka',
  icon: 'ti-link',
  color: '#1a7a6e',
  description: 'Párování slov',

  createEmpty: () => ({
    pairs: [
      { id: uuid(), left: '', right: '', color: '#1a7a6e' },
      { id: uuid(), left: '', right: '', color: '#1a6fd4' },
      { id: uuid(), left: '', right: '', color: '#c47c1a' },
    ],
    leftLabel: 'Anglicky',
    rightLabel: 'Česky',
    rightType: 'text',
  }),

  autoGenerate: autoGenerateConnector,

  validate: (data: ConnectorData) => {
    if (data.pairs.length < 3) return { valid: false, errors: ['Min. 3 páry'] };
    const empty = data.pairs.filter((p) => !p.left.trim() || !p.right.trim());
    if (empty.length > 0) return { valid: false, errors: ['Všechna pole musí být vyplněna'] };
    return { valid: true, errors: [] };
  },

  estimateTime: (data: ConnectorData) => data.pairs.length * 8,

  EditorComponent: lazy(() => import('./ConnectorEditor')),
  PreviewComponent: lazy(() => import('./ConnectorPreview')),
  ThumbnailComponent: lazy(() => import('./ConnectorThumbnail')),
};
