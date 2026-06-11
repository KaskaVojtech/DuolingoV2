'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/ui.store';
import { AdminButton } from '@/components/admin/common/AdminButton';

export function DeleteCourseModal() {
  const { getModal, closeModal } = useUIStore();
  const modal = getModal('deleteCourse');
  const { isOpen, payload } = modal;
  const courseId = typeof payload.courseId === 'string' ? payload.courseId : '';

  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const block = (e: KeyboardEvent) => { if (e.key === 'Escape') e.preventDefault(); };
    document.addEventListener('keydown', block);
    return () => document.removeEventListener('keydown', block);
  }, [isOpen]);

  const handleDelete = () => {
    closeModal('deleteCourse');
    router.push(`/admin/courses/${courseId}/delete`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.7)' }}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-admin-surface border border-admin-danger rounded-admin-lg w-full max-w-[480px] mx-4 overflow-hidden">

        <div className="h-1.5 bg-admin-danger" />

        <div className="p-admin-xl flex flex-col gap-admin-md">
          <div className="flex flex-col items-center gap-admin-sm text-center">
            <i className="ti ti-alert-triangle text-admin-danger" style={{ fontSize: 48 }} aria-hidden="true" />
            <h2 className="text-admin-lg font-semibold text-admin-text">Opravdu chcete smazat tento kurz?</h2>
            <p className="text-admin-sm text-admin-text-muted">
              Tato akce je <strong className="text-admin-text">nevratná</strong>. Budou trvale odstraněny:
            </p>
          </div>

          <ul className="text-admin-sm text-admin-text-muted list-disc list-inside space-y-1">
            <li>Všechny lekce a jejich obsah</li>
            <li>Všechny přístupové kódy</li>
            <li>Všechny emailové přístupy</li>
            <li>Historie přihlášení uživatelů</li>
          </ul>

          <p className="text-admin-xs text-admin-text-muted text-center">
            V dalším kroku potvrdíš smazání opsáním názvu kurzu.
          </p>

          <div className="flex gap-admin-sm justify-between pt-admin-sm">
            <AdminButton variant="ghost" onClick={() => closeModal('deleteCourse')}>Zrušit</AdminButton>
            <AdminButton
              variant="danger"
              icon="ti-arrow-right"
              onClick={handleDelete}
            >
              Pokračovat
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}
