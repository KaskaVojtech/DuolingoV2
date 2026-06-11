'use client';

import { useState } from 'react';
import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';
import { wouldCreateCycle } from '@/lib/lessons-list/constraints.utils';
import { Lesson } from '@/lib/lessons-list/lessons-list.types';
import { v4 as uuid } from 'uuid';

interface ConstraintDropZoneProps {
  targetLesson: Lesson;
  onAdd: (sourceLessonId: string, sourceTitle: string) => void;
}

export function ConstraintDropZone({ targetLesson, onAdd }: ConstraintDropZoneProps) {
  const { lessons } = useLessonsListStore();
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');

  const available = lessons.filter((l) => l.id !== targetLesson.id);

  const handleAdd = (source: Lesson) => {
    if (wouldCreateCycle(targetLesson.id, source.id, lessons)) {
      setError(`Přidání "${source.title}" by vytvořilo cyklickou závislost.`);
      return;
    }
    setError('');
    onAdd(source.id, source.title);
    setShowPicker(false);
  };

  return (
    <div className="mb-2">
      <div
        className="constraint-drop-zone flex flex-col items-center justify-center gap-2 py-4 cursor-pointer"
        onClick={() => setShowPicker(!showPicker)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowPicker(!showPicker)}
        aria-label="Přidat podmínkovou lekci"
      >
        <i className="ti ti-drag-drop text-[24px] text-admin-text-muted" aria-hidden="true" />
        <p className="text-admin-xs text-admin-text-muted">
          {showPicker ? 'Vyberte lekci:' : 'Klikněte pro přidání podmínky'}
        </p>
      </div>
      {error && <p className="text-admin-xs text-admin-danger mt-1">{error}</p>}
      {showPicker && (
        <div className="border border-admin-border rounded-admin-sm overflow-hidden mt-1">
          {available.map((l) => (
            <button
              key={l.id}
              onClick={() => handleAdd(l)}
              className="w-full flex items-center gap-2 px-3 py-2 text-admin-xs text-admin-text hover:bg-admin-surface-2 text-left transition-colors border-b border-admin-border last:border-0"
            >
              <i className="ti ti-file text-[14px] text-admin-text-muted shrink-0" aria-hidden="true" />
              {l.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
