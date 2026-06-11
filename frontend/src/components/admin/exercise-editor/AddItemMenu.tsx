'use client';

import { useExerciseStore } from '@/lib/exercise/exercise.store';
import {
  createInlineItem, createMcItem, createHighlightItem, createTableItem,
  createDragAndDropItem, createImageItem, createAudioItem, createVideoItem, createAnswerItem,
} from '@/lib/exercise/exercise.utils';
import { ExerciseItem } from '@/lib/exercise/exercise.types';

interface AddItemMenuProps { onClose: () => void; }

const ITEMS: { icon: string; label: string; color: string; create: () => ExerciseItem }[] = [
  { icon: 'ti-text-size', label: 'Text', color: '#8c91bd', create: createInlineItem },
  { icon: 'ti-photo', label: 'Obrázek', color: '#2db868', create: createImageItem },
  { icon: 'ti-music', label: 'Audio', color: '#9b59f7', create: createAudioItem },
  { icon: 'ti-movie', label: 'Video', color: '#5b7cfa', create: createVideoItem },
  { icon: 'ti-message', label: 'Odpověď', color: '#f5a623', create: createAnswerItem },
  { icon: 'ti-list-check', label: 'Multiple choice', color: '#f7c948', create: createMcItem },
  { icon: 'ti-highlight', label: 'Zvýraznění', color: '#f0566b', create: createHighlightItem },
  { icon: 'ti-table', label: 'Tabulka', color: '#2db8b8', create: createTableItem },
  { icon: 'ti-arrows-shuffle', label: 'Přetahování', color: '#b464c8', create: createDragAndDropItem },
];

export function AddItemMenu({ onClose }: AddItemMenuProps) {
  const { addItem } = useExerciseStore();

  return (
    <div className="add-item-menu">
      {ITEMS.map(({ icon, label, color, create }) => (
        <button
          key={label}
          className="add-item-btn"
          onClick={() => { addItem(create()); onClose(); }}
        >
          <i className={`ti ${icon}`} style={{ color }} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}
