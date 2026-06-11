'use client';

import { useUIStore } from '@/lib/stores/ui.store';
import { useRemoveWord } from '@/lib/vocabulary/vocabulary.api';
import { AdminButton } from '@/components/admin/common/AdminButton';

interface Props { lessonId: string }

export function DeleteWordModal({ lessonId }: Props) {
  const { getModal, closeModal } = useUIStore();
  const modal = getModal('deleteWord');
  const { mutateAsync, isPending } = useRemoveWord(lessonId);

  const entryId = typeof modal.payload.entryId === 'string' ? modal.payload.entryId : '';
  const wordEn = typeof modal.payload.wordEn === 'string' ? modal.payload.wordEn : '';
  const wordCs = typeof modal.payload.wordCs === 'string' ? modal.payload.wordCs : '';

  const close = () => closeModal('deleteWord');

  if (!modal.isOpen) return null;

  const handleDelete = async () => {
    await mutateAsync(entryId);
    close();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }} onClick={close}>
      <div className="bg-admin-surface border border-admin-border rounded-admin-lg p-admin-xl w-full max-w-[400px] mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-admin-lg">
          <h2 className="text-admin-base font-semibold text-admin-text">Smazat slovíčko?</h2>
          <button onClick={close} className="text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-x text-[16px]" aria-hidden="true" />
          </button>
        </div>

        <p className="text-admin-sm text-admin-text mb-admin-md">
          &ldquo;<strong>{wordEn}</strong> → {wordCs}&rdquo;
        </p>

        <div className="bg-admin-surface-2 border border-admin-border rounded-admin-md p-admin-md mb-admin-lg text-admin-xs text-admin-text-muted">
          <p>Slovíčko bude <strong className="text-admin-text">odebráno z této lekce</strong>.</p>
          <p className="mt-1">V ostatních lekcích zůstane zachováno.</p>
        </div>

        <div className="flex items-center justify-between gap-admin-sm">
          <AdminButton variant="ghost" onClick={close}>Zrušit</AdminButton>
          <AdminButton variant="danger" loading={isPending} icon="ti-trash" onClick={handleDelete}>Odebrat</AdminButton>
        </div>
      </div>
    </div>
  );
}
