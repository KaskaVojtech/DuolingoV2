'use client';

import { useUIStore } from '@/lib/stores/ui.store';
import { useUpdateWord } from '@/lib/vocabulary/vocabulary.api';
import { useLessonVocabulary } from '@/lib/vocabulary/vocabulary.api';
import { useVocabularyStore } from '@/lib/vocabulary/vocabulary.store';
import { PartOfSpeech } from '@/lib/vocabulary/vocabulary.types';
import { AddWordPhase2 } from './AddWordPhase2';

interface Props { lessonId: string }

export function EditWordModal({ lessonId }: Props) {
  const { getModal, closeModal } = useUIStore();
  const modal = getModal('editWord');
  const { filter } = useVocabularyStore();
  const { data: entries } = useLessonVocabulary(lessonId, filter);
  const { mutateAsync, isPending } = useUpdateWord(lessonId);

  const wordId = typeof modal.payload.wordId === 'string' ? modal.payload.wordId : '';
  const entry = entries?.find((e) => e.word.id === wordId);
  const word = entry?.word;

  const close = () => closeModal('editWord');

  if (!modal.isOpen || !word) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }} onClick={close}>
      <div className="bg-admin-surface border border-admin-border rounded-admin-lg p-admin-xl w-full max-w-[480px] mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-admin-lg">
          <h2 className="text-admin-base font-semibold text-admin-text">Upravit slovíčko</h2>
          <button onClick={close} className="text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-x text-[16px]" aria-hidden="true" />
          </button>
        </div>

        <AddWordPhase2
          wordEn={word.wordEn}
          wordCs={word.wordCs}
          initial={word}
          submitLabel="Uložit změny"
          showWarning
          onClose={close}
          loading={isPending}
          onSubmit={async (data) => {
            await mutateAsync({
              wordId: word.id,
              patch: {
                pos: data.pos as PartOfSpeech,
                exampleSentence: data.exampleSentence,
                note: data.note,
                pronunciationUrl: data.pronunciationUrl ?? null,
                imageUrl: data.imageUrl ?? null,
              },
            });
            close();
          }}
        />
      </div>
    </div>
  );
}
