import { lazy } from 'react';
import { v4 as uuid } from 'uuid';
import { GamePlugin } from '@/lib/mix-editor/mix-editor.types';
import { WordOrderData } from './word-order.types';
import { autoGenerateWordOrder } from './word-order.generator';

export const WordOrderPlugin: GamePlugin<WordOrderData> = {
  type: 'word_order',
  label: 'Řazení slov',
  icon: 'ti-reorder',
  color: '#c44a2a',
  description: 'Seřaď větu ze slov',

  createEmpty: () => ({
    sentences: [{ id: uuid(), words: [] }],
    showHint: true,
  }),

  autoGenerate: autoGenerateWordOrder,

  validate: (data: WordOrderData) => {
    const errors: string[] = [];
    if (data.sentences.length < 1) errors.push('Min. 1 věta');
    for (const s of data.sentences) {
      if (s.words.length < 3) errors.push('Každá věta musí mít min. 3 slova');
    }
    return { valid: errors.length === 0, errors };
  },

  estimateTime: (data: WordOrderData) => {
    if (data.sentences.length === 0) return 0;
    const avgWords = data.sentences.reduce((s, sen) => s + sen.words.length, 0) / data.sentences.length;
    return Math.round(data.sentences.length * avgWords * 3);
  },

  EditorComponent: lazy(() => import('./WordOrderEditor')),
  PreviewComponent: lazy(() => import('./WordOrderPreview')),
  ThumbnailComponent: lazy(() => import('./WordOrderThumbnail')),
};
