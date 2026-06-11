'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/lib/stores/ui.store';
import { useLessonsListStore } from '@/lib/lessons-list/lessons-list.store';
import { deleteLesson } from '@/lib/lessons-list/lessons-list.api';
import { getConstraintImpacts, resolveConstraintImpacts } from '@/lib/lessons-list/constraints.utils';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { DeleteLessonConstraintList } from './DeleteLessonConstraintList';
import { ConstraintImpact } from '@/lib/lessons-list/lessons-list.types';

export function DeleteLessonModal() {
  const { getModal, closeModal, showToast } = useUIStore();
  const modal = getModal('deleteLesson');
  const { isOpen, payload } = modal;
  const lessonId = typeof payload.lessonId === 'string' ? payload.lessonId : '';
  const lessonTitle = typeof payload.lessonTitle === 'string' ? payload.lessonTitle : '';

  const { lessons, removeLesson, setLessons, courseTitle } = useLessonsListStore();
  const [impacts, setImpacts] = useState<ConstraintImpact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && lessonId) {
      setImpacts(getConstraintImpacts(lessonId, lessons));
    }
  }, [isOpen, lessonId, lessons]);

  useEffect(() => {
    if (!isOpen) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal('deleteLesson'); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isOpen, closeModal]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteLesson(lessonId);

      const updated = resolveConstraintImpacts(impacts, lessonId, lessons)
        .filter((l) => l.id !== lessonId)
        .map((l, i) => ({ ...l, order: i + 1 }));
      setLessons(updated, courseTitle);
      closeModal('deleteLesson');
      showToast('Lekce smazána', 'success');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.6)' }}
      onClick={() => closeModal('deleteLesson')}
    >
      <div
        className="bg-admin-surface border border-admin-border rounded-admin-lg p-admin-xl w-full max-w-[480px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-admin-md">
          <i className="ti ti-alert-triangle text-admin-danger text-[22px] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="text-admin-base font-semibold text-admin-text">Smazat lekci?</h2>
            <p className="text-admin-sm text-admin-text-muted mt-0.5">&ldquo;{lessonTitle}&rdquo;</p>
          </div>
          <button onClick={() => closeModal('deleteLesson')} className="ml-auto text-admin-text-muted hover:text-admin-text">
            <i className="ti ti-x text-[16px]" aria-hidden="true" />
          </button>
        </div>

        {impacts.length === 0 ? (
          <p className="text-admin-sm text-admin-text-muted mb-admin-md">Tato akce je nevratná.</p>
        ) : (
          <DeleteLessonConstraintList impacts={impacts} />
        )}

        <div className="flex gap-admin-sm justify-between">
          <AdminButton variant="ghost" onClick={() => closeModal('deleteLesson')}>Zrušit</AdminButton>
          <AdminButton variant="danger" loading={loading} icon="ti-trash" onClick={handleDelete}>
            Jsem si vědom, smazat
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
