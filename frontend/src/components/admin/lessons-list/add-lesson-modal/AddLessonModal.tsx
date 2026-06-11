'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/ui.store';
import { AddLessonSplitPanel } from './AddLessonSplitPanel';

export function AddLessonModal() {
  const { getModal, closeModal } = useUIStore();
  const modal = getModal('addLesson');
  const { isOpen, payload } = modal;
  const courseId = typeof payload.courseId === 'string' ? payload.courseId : '';
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal('addLesson'); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }}
      onClick={() => closeModal('addLesson')}
    >
      <div
        className="bg-admin-surface border border-admin-border rounded-admin-lg overflow-hidden w-full max-w-[560px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between px-admin-lg py-admin-md border-b border-admin-border">
          <h2 className="text-admin-base font-semibold text-admin-text">Přidat lekci</h2>
          <button onClick={() => closeModal('addLesson')} className="text-admin-text-muted hover:text-admin-text transition-colors">
            <i className="ti ti-x text-[18px]" aria-hidden="true" />
          </button>
        </div>

        <div className="flex" style={{ minHeight: 280 }}>
          <AddLessonSplitPanel
            icon="ti-file-plus"
            title="Nová lekce"
            description="Začněte s prázdnou lekcí a přidejte bloky obsahu."
            buttonLabel="Vytvořit lekci"
            onClick={() => { closeModal('addLesson'); router.push(`/admin/courses/${courseId}/lessons/new`); }}
          />
          <AddLessonSplitPanel
            icon="ti-template"
            title="Ze šablony"
            description="Použijte dříve uloženou šablonu lekce."
            buttonLabel="Vybrat šablonu"
            onClick={() => { closeModal('addLesson'); router.push(`/admin/lessons/templates?courseId=${courseId}`); }}
            isRight
          />
        </div>
      </div>
    </div>
  );
}
