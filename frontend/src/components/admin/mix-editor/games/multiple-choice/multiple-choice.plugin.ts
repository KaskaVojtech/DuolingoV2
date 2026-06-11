import { lazy } from 'react';
import { v4 as uuid } from 'uuid';
import { GamePlugin } from '@/lib/mix-editor/mix-editor.types';
import { MultipleChoiceData } from './multiple-choice.types';
import { autoGenerateMultipleChoice } from './multiple-choice.generator';

export const MultipleChoicePlugin: GamePlugin<MultipleChoiceData> = {
  type: 'multiple_choice',
  label: 'Multiple Choice',
  icon: 'ti-list-check',
  color: '#c47c1a',
  description: 'Vyber správnou odpověď',

  createEmpty: () => ({
    questions: [
      {
        id: uuid(),
        question: '',
        options: [
          { id: uuid(), text: '', isCorrect: true },
          { id: uuid(), text: '', isCorrect: false },
          { id: uuid(), text: '', isCorrect: false },
          { id: uuid(), text: '', isCorrect: false },
        ],
      },
    ],
    randomizeOptions: true,
  }),

  autoGenerate: autoGenerateMultipleChoice,

  validate: (data: MultipleChoiceData) => {
    const errors: string[] = [];
    if (data.questions.length < 1) errors.push('Min. 1 otázka');
    for (const q of data.questions) {
      if (!q.question.trim()) errors.push('Otázka nesmí být prázdná');
      if (!q.options.some((o) => o.isCorrect)) errors.push('Každá otázka musí mít správnou odpověď');
      if (q.options.some((o) => !o.text.trim())) errors.push('Všechny možnosti musí být vyplněny');
    }
    return { valid: errors.length === 0, errors };
  },

  estimateTime: (data: MultipleChoiceData) => data.questions.length * 12,

  EditorComponent: lazy(() => import('./MultipleChoiceEditor')),
  PreviewComponent: lazy(() => import('./MultipleChoicePreview')),
  ThumbnailComponent: lazy(() => import('./MultipleChoiceThumbnail')),
};
