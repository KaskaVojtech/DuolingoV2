import { lazy } from 'react';
import { v4 as uuid } from 'uuid';
import { GamePlugin } from '@/lib/mix-editor/mix-editor.types';
import { WordTransformData } from './word-transform.types';
import { autoGenerateWordTransform } from './word-transform.generator';

export const WordTransformPlugin: GamePlugin<WordTransformData> = {
  type: 'word_transform',
  label: 'Přepis tvaru',
  icon: 'ti-abc',
  color: '#b43d6a',
  description: 'Dej slovo do správného tvaru',

  createEmpty: () => ({
    items: [
      { id: uuid(), sentence: '', baseWord: '', answer: '', instruction: '', acceptAlso: [] },
    ],
  }),

  autoGenerate: autoGenerateWordTransform,

  validate: (data: WordTransformData) => {
    const errors: string[] = [];
    if (data.items.length < 1) errors.push('Min. 1 položka');
    for (const item of data.items) {
      if (!item.sentence.includes('{word}')) errors.push('Věta musí obsahovat {word}');
      if (!item.baseWord.trim() || !item.answer.trim()) errors.push('Základní tvar a správný tvar jsou povinné');
    }
    return { valid: errors.length === 0, errors };
  },

  estimateTime: (data: WordTransformData) => data.items.length * 18,

  EditorComponent: lazy(() => import('./WordTransformEditor')),
  PreviewComponent: lazy(() => import('./WordTransformPreview')),
  ThumbnailComponent: lazy(() => import('./WordTransformThumbnail')),
};
