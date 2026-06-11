import { v4 as uuid } from 'uuid';
import {
  Exercise, ExerciseItem, InlineContent, McComponent, HighlightComponent,
  TableComponent, DragAndDropComponent, ImageComponent, AudioComponent,
  VideoComponent, AnswerComponent,
} from './exercise.types';

export function generateId(): string {
  return uuid();
}

export function createEmptyExercise(lessonId: string): Exercise {
  return {
    id: uuid(),
    lessonId,
    title: 'Nové cvičení',
    instructions: '',
    xp: 10,
    items: [],
  };
}

export function createInlineItem(): InlineContent {
  return {
    type: 'inline',
    id: uuid(),
    nodes: [{ type: 'text', value: '' }],
  };
}

export function createMcItem(): McComponent {
  return {
    type: 'mc',
    id: uuid(),
    question: '',
    options: [
      { id: uuid(), value: '', correct: true },
      { id: uuid(), value: '', correct: false },
    ],
    multiple: false,
  };
}

export function createHighlightItem(): HighlightComponent {
  return {
    type: 'highlight',
    id: uuid(),
    instruction: '',
    multiple: false,
    content: [{ type: 'text', value: '' }],
  };
}

export function createTableItem(): TableComponent {
  return {
    type: 'table',
    id: uuid(),
    columns: ['Sloupec 1', 'Sloupec 2'],
    rows: [[{ type: 'static', value: '' }, { type: 'static', value: '' }]],
  };
}

export function createDragAndDropItem(): DragAndDropComponent {
  const sourceId = uuid();
  return {
    type: 'drag_and_drop',
    id: uuid(),
    source: { type: 'drag_source', id: sourceId, words: [], allowReuse: false },
    targets: [],
  };
}

export function createImageItem(): ImageComponent {
  return { type: 'image', id: uuid(), url: '', caption: '' };
}

export function createAudioItem(): AudioComponent {
  return { type: 'audio', id: uuid(), url: '', title: '' };
}

export function createVideoItem(): VideoComponent {
  return { type: 'video', id: uuid(), url: '', title: '' };
}

export function createAnswerItem(): AnswerComponent {
  return { type: 'answer', id: uuid(), length: 'short', evaluation: 'auto', placeholder: '' };
}

export function getItemLabel(item: ExerciseItem): string {
  switch (item.type) {
    case 'inline': return 'Text';
    case 'image': return 'Obrázek';
    case 'audio': return 'Audio';
    case 'video': return 'Video';
    case 'answer': return 'Odpověď';
    case 'mc': return 'Multiple choice';
    case 'highlight': return 'Zvýraznění';
    case 'table': return 'Tabulka';
    case 'drag_and_drop': return 'Přetahování';
  }
}
