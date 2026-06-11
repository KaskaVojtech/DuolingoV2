'use client';

import { useEffect, useRef, useState } from 'react';
import { useUIStore } from '@/lib/stores/ui.store';
import { saveAsTemplate } from '@/lib/courses/courses.api';
import { saveLessonAsTemplate } from '@/lib/lessons-list/lessons-list.api';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { AdminInput } from '@/components/admin/common/AdminInput';

export function SaveAsTemplateModal() {
  const { getModal, closeModal } = useUIStore();
  const modal = getModal('saveTemplate');
  const { isOpen, payload } = modal;

  const defaultName = typeof payload.defaultName === 'string' ? payload.defaultName : '';
  const courseId = typeof payload.courseId === 'string' ? payload.courseId : '';
  const targetType = typeof payload.targetType === 'string' ? payload.targetType : 'course';
  const targetId = typeof payload.targetId === 'string' ? payload.targetId : '';
  const isLesson = targetType === 'lesson';

  const [name, setName] = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setError(null);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, defaultName]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const focusable = document.querySelectorAll<HTMLElement>(
          '[data-modal-focus] button:not(:disabled), [data-modal-focus] input:not(:disabled)'
        );
        const arr = Array.from(focusable);
        if (!arr.length) return;
        const first = arr[0];
        const last = arr[arr.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const close = () => closeModal('saveTemplate');

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (isLesson) {
        await saveLessonAsTemplate({ lessonId: targetId, templateName: name.trim() });
      } else {
        await saveAsTemplate({ courseId, templateName: name.trim() });
      }
      close();
      useUIStore.getState().showToast('Šablona uložena', 'success');
    } catch {
      setError('Uložení šablony selhalo. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }}
      onClick={close}
      aria-modal="true"
      role="dialog"
      aria-label="Uložit jako šablonu"
    >
      <div
        data-modal-focus
        className="bg-admin-surface border border-admin-border rounded-admin-lg p-admin-xl w-full max-w-[400px] mx-4 flex flex-col gap-admin-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-admin-lg font-semibold text-admin-text mb-1">Uložit jako šablonu</h2>
          <p className="text-admin-sm text-admin-text-muted">
            {isLesson
              ? 'Lekce bude označena jako šablona a odpojena od kurzu — bude dostupná k importu do jiných kurzů.'
              : 'Zadejte název šablony. Všechny bloky kurzu budou uloženy pro opakované použití.'}
          </p>
        </div>

        <AdminInput
          ref={inputRef}
          label="Název šablony"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !loading) handleSubmit(); }}
          disabled={loading}
        />

        {error && (
          <p className="text-admin-xs text-admin-danger">{error}</p>
        )}

        <div className="flex gap-admin-sm justify-end">
          <AdminButton variant="ghost" onClick={close} disabled={loading}>
            Zrušit
          </AdminButton>
          <AdminButton
            variant="primary"
            loading={loading}
            disabled={!name.trim()}
            onClick={handleSubmit}
          >
            Uložit šablonu
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
