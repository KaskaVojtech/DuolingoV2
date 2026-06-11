import { lazy } from 'react';
import { v4 as uuid } from 'uuid';
import { GamePlugin } from '@/lib/mix-editor/mix-editor.types';
import { ListeningData } from './listening.types';
import { autoGenerateListening } from './listening.generator';

export const ListeningPlugin: GamePlugin<ListeningData> = {
  type: 'listening',
  label: 'Poslech',
  icon: 'ti-headphones',
  color: '#6a3db8',
  description: 'Poslechni a odpověz',

  createEmpty: () => ({
    questions: [
      {
        id: uuid(),
        audioUrl: '',
        question: 'What did you hear?',
        options: [
          { id: uuid(), text: '', isCorrect: true },
          { id: uuid(), text: '', isCorrect: false },
          { id: uuid(), text: '', isCorrect: false },
          { id: uuid(), text: '', isCorrect: false },
        ],
      },
    ],
    playCount: 2,
  }),

  autoGenerate: autoGenerateListening,

  validate: (data: ListeningData) => {
    const errors: string[] = [];
    if (data.questions.length < 1) errors.push('Min. 1 otázka');
    for (const q of data.questions) {
      if (!q.audioUrl.trim()) errors.push('Chybí URL audia');
      if (!q.options.some((o) => o.isCorrect)) errors.push('Každá otázka musí mít správnou odpověď');
    }
    return { valid: errors.length === 0, errors };
  },

  estimateTime: (data: ListeningData) => data.questions.length * 20,

  EditorComponent: lazy(() => import('./ListeningEditor')),
  PreviewComponent: lazy(() => import('./ListeningPreview')),
  ThumbnailComponent: lazy(() => import('./ListeningThumbnail')),
};
