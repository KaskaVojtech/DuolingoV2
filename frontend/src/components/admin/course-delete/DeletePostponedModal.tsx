'use client';

import { useEffect } from 'react';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { CourseDeleteResult } from '@/lib/course-delete/course-delete.types';

interface DeletePostponedModalProps {
  result: CourseDeleteResult;
  onConfirm: () => void;
}

export function DeletePostponedModal({ result, onConfirm }: DeletePostponedModalProps) {

  useEffect(() => {
    const block = (e: KeyboardEvent) => { if (e.key === 'Escape') e.preventDefault(); };
    document.addEventListener('keydown', block);
    return () => document.removeEventListener('keydown', block);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.7)' }}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-admin-surface border border-admin-border rounded-admin-lg w-full max-w-[480px] mx-4 overflow-hidden">
        <div className="h-1.5 bg-[#2db868]" />
        <div className="p-admin-xl flex flex-col items-center gap-admin-md text-center">
          <i className="ti ti-clock text-[#2db868]" style={{ fontSize: 48 }} aria-hidden="true" />
          <h2 className="text-admin-lg font-semibold text-admin-text">Kurz byl označen ke smazání</h2>

          <div className="border border-admin-border rounded-admin-md px-admin-xl py-admin-md">
            <p className="text-admin-2xl font-bold text-admin-text">{result.scheduledDeleteAt}</p>
            <p className="text-admin-sm text-admin-text-muted">za 30 dní</p>
          </div>

          {result.preservedLessonsCount > 0 && (
            <p className="text-admin-sm text-admin-text-muted">
              {result.preservedLessonsCount} lekcí bylo zachováno a přesunuto do globálních lekcí.
            </p>
          )}

          <p className="text-admin-xs text-admin-text-muted">
            Kurz najdeš v sekci <span className="font-bold text-admin-text">Smazané kurzy</span>, kde jej můžeš
            kdykoli před termínem obnovit.
          </p>

          <AdminButton variant="primary" className="w-full justify-center mt-admin-sm" onClick={onConfirm}>
            Rozumím, přejít na seznam kurzů
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
