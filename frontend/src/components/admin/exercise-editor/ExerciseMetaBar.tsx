'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useExerciseStore } from '@/lib/exercise/exercise.store';
import { useUIStore } from '@/lib/stores/ui.store';
import { AdminButton } from '@/components/admin/common/AdminButton';

interface Props {
  courseTitle: string;
  lessonTitle: string;
  courseId: string;
  lessonId: string;
}

export function ExerciseMetaBar({ courseTitle, lessonTitle, courseId, lessonId }: Props) {
  const { exercise, isDirty, isSaving, previewMode, setTitle, setXp, togglePreview, saveExercise } = useExerciseStore();
  const canSave = !!exercise.lessonId;
  const { showToast } = useUIStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [titleVal, setTitleVal] = useState(exercise.title);

  useEffect(() => { setTitleVal(exercise.title); }, [exercise.title]);

  const handleTitleChange = (v: string) => {
    setTitleVal(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setTitle(v); }, 800);
  };

  const handleSave = async () => {
    try {
      await saveExercise();
      showToast('Cvičení uloženo', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Chyba při ukládání';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="flex items-center gap-admin-md px-admin-lg h-[56px] bg-toolbar-bg border-b border-toolbar-border sticky top-0 z-30">

      <div className="flex items-center gap-admin-sm min-w-0">
        <div className="hidden lg:flex items-center gap-1 text-admin-xs text-admin-text-muted shrink-0">
          <Link href="/admin/courses" className="hover:text-admin-text">{courseTitle || 'Kurzy'}</Link>
          <i className="ti ti-chevron-right text-[10px]" aria-hidden="true" />
          {courseId ? (
            <Link href={`/admin/courses/${courseId}/lessons`} className="hover:text-admin-text">{lessonTitle || 'Lekce'}</Link>
          ) : (
            <span>{lessonTitle || 'Lekce'}</span>
          )}
          <i className="ti ti-chevron-right text-[10px]" aria-hidden="true" />
        </div>
        <input
          className="bg-transparent border-b border-admin-border focus:border-admin-primary text-admin-sm text-admin-text outline-none py-0.5 min-w-[160px] max-w-[280px]"
          value={titleVal}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Název cvičení..."
        />
        {isDirty && <span className="text-admin-xs text-admin-text-muted shrink-0">●</span>}
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex border border-admin-border rounded-admin-sm overflow-hidden">
          {(['editor', 'preview'] as const).map((mode) => {
            const active = mode === 'preview' ? previewMode : !previewMode;
            return (
              <button
                key={mode}
                onClick={() => { if ((mode === 'preview') !== previewMode) togglePreview(); }}
                className={`px-admin-md py-1 text-admin-xs font-medium transition-colors ${active ? 'bg-admin-primary text-white' : 'bg-transparent text-admin-text-muted hover:text-admin-text'}`}
              >
                {mode === 'editor' ? 'Editor' : 'Preview'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-admin-md">
        <label className="flex items-center gap-1">
          <span className="text-admin-xs text-admin-text-muted">XP</span>
          <input
            type="number"
            min={0}
            max={9999}
            className="w-16 bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text text-center"
            value={exercise.xp}
            onChange={(e) => setXp(Math.min(9999, Math.max(0, Number(e.target.value))))}
          />
        </label>
        <AdminButton
          variant="primary"
          loading={isSaving}
          disabled={!canSave}
          onClick={handleSave}
          icon="ti-device-floppy"
        >
          Uložit
        </AdminButton>
      </div>
    </div>
  );
}
