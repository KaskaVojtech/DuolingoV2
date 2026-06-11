'use client';

import { useState } from 'react';
import { useUIStore } from '@/lib/stores/ui.store';
import { LessonForImport } from '@/lib/vocabulary/vocabulary.types';
import { ImportLessonPicker } from './ImportLessonPicker';
import { ImportWordList } from './ImportWordList';

interface Props { lessonId: string }

export function ImportVocabularyModal({ lessonId }: Props) {
  const { getModal, closeModal } = useUIStore();
  const modal = getModal('importVocabulary');
  const [selectedLesson, setSelectedLesson] = useState<LessonForImport | null>(null);

  const close = () => { closeModal('importVocabulary'); setSelectedLesson(null); };

  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }} onClick={close}>
      <div className="bg-admin-surface border border-admin-border rounded-admin-lg p-admin-xl w-full max-w-[560px] mx-4" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-admin-lg">
          <h2 className="text-admin-base font-semibold text-admin-text">
            {selectedLesson ? `Importovat ze: ${selectedLesson.title}` : 'Importovat slovíčka'}
          </h2>
          <button onClick={close} className="text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-x text-[16px]" aria-hidden="true" />
          </button>
        </div>

        {!selectedLesson ? (
          <ImportLessonPicker
            excludeLessonId={lessonId}
            onSelect={setSelectedLesson}
            onClose={close}
          />
        ) : (
          <ImportWordList
            sourceLesson={selectedLesson}
            currentLessonId={lessonId}
            onBack={() => setSelectedLesson(null)}
            onClose={close}
          />
        )}
      </div>
    </div>
  );
}
