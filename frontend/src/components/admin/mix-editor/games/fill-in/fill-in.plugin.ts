import { lazy } from 'react';
import { v4 as uuid } from 'uuid';
import { GamePlugin } from '@/lib/mix-editor/mix-editor.types';
import { FillInData } from './fill-in.types';
import { autoGenerateFillIn } from './fill-in.generator';

export const FillInPlugin: GamePlugin<FillInData> = {
  type: 'fill_in',
  label: 'Doplňovačka',
  icon: 'ti-text-plus',
  color: '#1a6fd4',
  description: 'Doplň chybějící slovo',

  createEmpty: () => ({
    sentences: [{ id: uuid(), sentence: '', answer: '' }],
    showHints: false,
  }),

  autoGenerate: autoGenerateFillIn,

  validate: (data: FillInData) => {
    const errors: string[] = [];
    if (data.sentences.length < 1) errors.push('Min. 1 věta');
    for (const s of data.sentences) {
      if (!s.sentence.includes('{blank}')) errors.push(`Věta "${s.sentence.slice(0, 20)}..." nemá {blank}`);
      if (!s.answer.trim()) errors.push('Každá věta musí mít odpověď');
    }
    return { valid: errors.length === 0, errors };
  },

  estimateTime: (data: FillInData) => data.sentences.length * 15,

  EditorComponent: lazy(() => import('./FillInEditor')),
  PreviewComponent: lazy(() => import('./FillInPreview')),
  ThumbnailComponent: lazy(() => import('./FillInThumbnail')),
};
