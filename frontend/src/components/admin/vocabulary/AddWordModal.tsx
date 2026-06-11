'use client';

import { useState } from 'react';
import { useUIStore } from '@/lib/stores/ui.store';
import { useAddWord } from '@/lib/vocabulary/vocabulary.api';
import { PartOfSpeech } from '@/lib/vocabulary/vocabulary.types';
import { AddWordPhase1 } from './AddWordPhase1';
import { AddWordPhase2 } from './AddWordPhase2';

interface Props { lessonId: string }

export function AddWordModal({ lessonId }: Props) {
  const { getModal, closeModal } = useUIStore();
  const modal = getModal('addWord');
  const { mutateAsync, isPending } = useAddWord(lessonId);
  const [phase, setPhase] = useState<1 | 2>(1);
  const [phase1Data, setPhase1Data] = useState<{ wordEn: string; wordCs: string } | null>(null);

  const close = () => { closeModal('addWord'); setPhase(1); setPhase1Data(null); };

  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }} onClick={close}>
      <div className="bg-admin-surface border border-admin-border rounded-admin-lg p-admin-xl w-full max-w-[480px] mx-4" onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-admin-lg">
          <div className="flex items-center gap-admin-md">
            <h2 className="text-admin-base font-semibold text-admin-text">Nové slovíčko</h2>

            <div className="modal-phase-indicator">
              {[1, 2].map((p) => (
                <span key={p} className={`modal-phase-indicator__dot ${phase >= p ? 'modal-phase-indicator__dot--active' : ''}`} />
              ))}
              <span className="ml-1">{phase} / 2</span>
            </div>
          </div>
          <button onClick={close} className="text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-x text-[16px]" aria-hidden="true" />
          </button>
        </div>

        {phase === 1 && (
          <AddWordPhase1
            onNext={(data) => { setPhase1Data(data); setPhase(2); }}
            onClose={close}
          />
        )}

        {phase === 2 && phase1Data && (
          <AddWordPhase2
            wordEn={phase1Data.wordEn}
            wordCs={phase1Data.wordCs}
            onBack={() => setPhase(1)}
            onClose={close}
            loading={isPending}
            onSubmit={async (data) => {
              await mutateAsync({
                word: { wordEn: phase1Data.wordEn, wordCs: phase1Data.wordCs, pos: data.pos as PartOfSpeech, exampleSentence: data.exampleSentence, imageUrl: data.imageUrl ?? null, pronunciationUrl: data.pronunciationUrl ?? null, note: data.note },
                pronunciationFile: data.pronunciationFile,
                imageFile: data.imageFile,
              });
              close();
            }}
          />
        )}
      </div>
    </div>
  );
}
