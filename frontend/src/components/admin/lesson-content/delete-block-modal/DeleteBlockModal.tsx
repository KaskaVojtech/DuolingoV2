'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/lib/stores/ui.store';
import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { deleteBlock } from '@/lib/lesson-content/lesson-content.api';
import { getBlockConstraintImpacts, resolveBlockConstraintImpacts } from '@/lib/lesson-content/block-constraints.utils';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { BlockTypeBadge } from '../BlockTypeBadge';
import { DeleteBlockConstraintList } from './DeleteBlockConstraintList';
import { BlockConstraintImpact, BlockType } from '@/lib/lesson-content/lesson-content.types';

export function DeleteBlockModal() {
  const { getModal, closeModal, showToast } = useUIStore();
  const modal = getModal('deleteBlock');
  const { isOpen, payload } = modal;
  const blockId = typeof payload.blockId === 'string' ? payload.blockId : '';
  const blockTitle = typeof payload.blockTitle === 'string' ? payload.blockTitle : '';
  const blockType = (payload.blockType as BlockType) ?? 'content';

  const { blocks, setBlocks, lessonId, lessonTitle, courseId, courseTitle } = useLessonContentStore();
  const [impacts, setImpacts] = useState<BlockConstraintImpact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && blockId) setImpacts(getBlockConstraintImpacts(blockId, blocks));
  }, [isOpen, blockId, blocks]);

  useEffect(() => {
    if (!isOpen) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal('deleteBlock'); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isOpen, closeModal]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBlock(blockId);
      const updated = resolveBlockConstraintImpacts(impacts, blockId, blocks)
        .filter((b) => b.id !== blockId)
        .map((b, i) => ({ ...b, order: i + 1 }));
      setBlocks(updated, lessonId, lessonTitle, courseId, courseTitle);
      closeModal('deleteBlock');
      showToast('Blok smazán', 'success');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }} onClick={() => closeModal('deleteBlock')}>
      <div className="bg-admin-surface border border-admin-border rounded-admin-lg p-admin-xl w-full max-w-[480px] mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3 mb-admin-md">
          <i className="ti ti-alert-triangle text-admin-danger text-[22px] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <h2 className="text-admin-base font-semibold text-admin-text">Smazat blok?</h2>
            <div className="flex items-center gap-2 mt-1">
              <BlockTypeBadge type={blockType} />
              <span className="text-admin-sm text-admin-text-muted">&ldquo;{blockTitle}&rdquo;</span>
            </div>
          </div>
          <button onClick={() => closeModal('deleteBlock')} className="text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-x text-[16px]" aria-hidden="true" />
          </button>
        </div>
        {impacts.length === 0
          ? <p className="text-admin-sm text-admin-text-muted mb-admin-md">Tato akce je nevratná.</p>
          : <DeleteBlockConstraintList impacts={impacts} />}
        <div className="flex gap-admin-sm justify-between">
          <AdminButton variant="ghost" onClick={() => closeModal('deleteBlock')}>Zrušit</AdminButton>
          <AdminButton variant="danger" loading={loading} icon="ti-trash" onClick={handleDelete}>Jsem si vědom, smazat</AdminButton>
        </div>
      </div>
    </div>
  );
}
