import { lazy } from 'react';
import { v4 as uuid } from 'uuid';
import { GamePlugin } from '@/lib/mix-editor/mix-editor.types';
import { TranslationData } from './translation.types';
import { autoGenerateTranslation } from './translation.generator';

export const TranslationPlugin: GamePlugin<TranslationData> = {
  type: 'translation',
  label: 'Překlad',
  icon: 'ti-language',
  color: '#2d7a4a',
  description: 'Přelož slovo nebo frázi',

  createEmpty: () => ({
    items: [
      { id: uuid(), source: '', answer: '', acceptAlso: [], direction: 'en_to_cs' },
      { id: uuid(), source: '', answer: '', acceptAlso: [], direction: 'en_to_cs' },
      { id: uuid(), source: '', answer: '', acceptAlso: [], direction: 'en_to_cs' },
    ],
    inputType: 'text',
  }),

  autoGenerate: autoGenerateTranslation,

  validate: (data: TranslationData) => {
    const errors: string[] = [];
    if (data.items.length < 3) errors.push('Min. 3 položky');
    for (const item of data.items) {
      if (!item.source.trim() || !item.answer.trim()) errors.push('Všechna pole musí být vyplněna');
    }
    return { valid: errors.length === 0, errors };
  },

  estimateTime: (data: TranslationData) => data.items.length * 10,

  EditorComponent: lazy(() => import('./TranslationEditor')),
  PreviewComponent: lazy(() => import('./TranslationPreview')),
  ThumbnailComponent: lazy(() => import('./TranslationThumbnail')),
};
