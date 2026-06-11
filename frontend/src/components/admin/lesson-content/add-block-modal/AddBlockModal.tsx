'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/ui.store';
import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { createMixBlock } from '@/lib/lesson-content/lesson-content.api';
import { AddBlockSplitPanel } from './AddBlockSplitPanel';

type Step = 'main' | 'exercise' | 'mix-name';

export function AddBlockModal() {
  const { getModal, closeModal } = useUIStore();
  const modal = getModal('addBlock');
  const { isOpen } = modal;
  const router = useRouter();
  const { lessonId } = useLessonContentStore();
  const [step, setStep] = useState<Step>('main');
  const [mixName, setMixName] = useState('');
  const [isCreatingMix, setIsCreatingMix] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) { setStep('main'); setMixName(''); }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'mix-name') nameInputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (!isOpen) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal('addBlock'); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  async function handleCreateMix() {
    if (isCreatingMix) return;
    const title = mixName.trim() || 'Mix her';
    setIsCreatingMix(true);
    try {
      await createMixBlock(lessonId, title);
      closeModal('addBlock');
      router.push(`/admin/lessons/${lessonId}/mix?from=content`);
    } catch {
      useUIStore.getState().showToast('Chyba při vytváření bloku', 'error');
    } finally {
      setIsCreatingMix(false);
    }
  }

  const backStep: Record<Step, Step | null> = { main: null, exercise: 'main', 'mix-name': 'exercise' };
  const titles: Record<Step, string> = { main: 'Přidat blok', exercise: 'Typ cvičení', 'mix-name': 'Nový mix her' };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }} onClick={() => closeModal('addBlock')}>
      <div className="border border-admin-border rounded-admin-lg overflow-hidden w-full max-w-[560px] mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-admin-lg py-admin-md border-b border-admin-border bg-admin-surface">
          <div className="flex items-center gap-2">
            {backStep[step] && (
              <button onClick={() => setStep(backStep[step]!)} className="text-admin-text-muted hover:text-admin-text">
                <i className="ti ti-arrow-left text-[16px]" aria-hidden="true" />
              </button>
            )}
            <h2 className="text-admin-base font-semibold text-admin-text">{titles[step]}</h2>
          </div>
          <button onClick={() => closeModal('addBlock')} className="text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-x text-[18px]" aria-hidden="true" />
          </button>
        </div>

        {step === 'main' && (
          <div className="flex" style={{ minHeight: 280 }}>
            <AddBlockSplitPanel
              icon="ti-pencil"
              title="Vytvořit cvičení"
              titleColor="#5b7cfa"
              description="Interaktivní blok s otázkami, úkoly nebo testy."
              buttonLabel="Vytvořit cvičení"
              buttonColor="#5b7cfa"
              panelClass="add-block-modal__panel--exercise"
              onClick={() => setStep('exercise')}
            />
            <div className="add-block-modal__divider" />
            <AddBlockSplitPanel
              icon="ti-file-text"
              title="Vytvořit obsah"
              titleColor="#f0566b"
              description="Textový, multimediální nebo informační blok."
              buttonLabel="Vytvořit obsah"
              buttonColor="#f0566b"
              panelClass="add-block-modal__panel--content"
              onClick={() => { closeModal('addBlock'); router.push(`/admin/lessons/${lessonId}/blocks/new-content`); }}
            />
          </div>
        )}

        {step === 'exercise' && (
          <div className="flex" style={{ minHeight: 280 }}>
            <AddBlockSplitPanel
              icon="ti-pencil"
              title="Vlastní cvičení"
              titleColor="#5b7cfa"
              description="Vlastní otázky, úkoly a testy sestavené ručně."
              buttonLabel="Vlastní cvičení"
              buttonColor="#5b7cfa"
              panelClass="add-block-modal__panel--exercise"
              onClick={() => { closeModal('addBlock'); router.push(`/admin/lessons/${lessonId}/blocks/new-exercise`); }}
            />
            <div className="add-block-modal__divider" />
            <AddBlockSplitPanel
              icon="ti-puzzle"
              title="Mix her"
              titleColor="#22c55e"
              description="Automaticky generované mini-hry ze slovíček lekce."
              buttonLabel="Mix her"
              buttonColor="#22c55e"
              panelClass="add-block-modal__panel--mix"
              onClick={() => setStep('mix-name')}
            />
          </div>
        )}

        {step === 'mix-name' && (
          <div className="px-admin-lg py-admin-xl flex flex-col gap-admin-md" style={{ minHeight: 280 }}>
            <p className="text-admin-sm text-admin-text-muted">Zadejte název pro tento mix her. Název lze později změnit.</p>
            <div className="flex flex-col gap-2">
              <label className="text-admin-xs font-medium text-admin-text-muted uppercase tracking-wide">Název</label>
              <input
                ref={nameInputRef}
                type="text"
                className="admin-input w-full"
                placeholder="Např. Procvičení slovíček — lekce 1"
                value={mixName}
                maxLength={255}
                onChange={(e) => setMixName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateMix(); }}
              />
            </div>
            <div className="flex justify-end gap-2 mt-auto">
              <button
                type="button"
                className="px-admin-md py-2 text-admin-sm text-admin-text-muted hover:text-admin-text border border-admin-border rounded-admin-sm"
                onClick={() => setStep('exercise')}
              >
                Zpět
              </button>
              <button
                type="button"
                disabled={isCreatingMix}
                className="px-admin-md py-2 text-admin-sm font-medium rounded-admin-sm border"
                style={{ color: '#22c55e', borderColor: '#22c55e', opacity: isCreatingMix ? 0.6 : 1 }}
                onClick={handleCreateMix}
              >
                {isCreatingMix ? 'Vytváření…' : 'Vytvořit mix'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
