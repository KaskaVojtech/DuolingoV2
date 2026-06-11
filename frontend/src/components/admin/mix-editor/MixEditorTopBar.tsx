'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';
import { estimateTotalTime, formatTime, validateMix } from '@/lib/mix-editor/mix-editor.utils';
import { AdminButton } from '../common/AdminButton';
import { LessonNavTabs } from '../common/LessonNavTabs';

export function MixEditorTopBar() {
  const { mix, lessonTitle, isSaving, isDirty, saveMix, setXp } = useMixEditorStore();
  const lessonId = mix.lessonId;
  const errors = validateMix(mix);
  const totalTime = estimateTotalTime(mix);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromContent = searchParams.get('from') === 'content';

  async function handleSave() {
    await saveMix();
    if (fromContent) {
      router.push(`/admin/lessons/${lessonId}/content`);
    }
  }

  return (
    <div className="mix-editor__topbar mix-editor-topbar">
      <Link href={`/admin/lessons/${lessonId}/content`} className="mix-editor-topbar__back">
        <i className="ti ti-arrow-left" />
        {lessonTitle || 'Obsah lekce'}
      </Link>

      {lessonId && <LessonNavTabs lessonId={lessonId} />}

      <div className="mix-editor-topbar__actions">
        {totalTime > 0 && (
          <span className="mix-editor-topbar__time">
            <i className="ti ti-clock" /> {formatTime(totalTime)}
          </span>
        )}
        <label className="mix-editor-topbar__xp">
          XP:
          <input
            type="number"
            min={0}
            max={500}
            step={10}
            className="mix-editor-topbar__xp-input"
            value={mix.xp}
            onChange={(e) => setXp(Number(e.target.value))}
          />
        </label>
        <AdminButton
          variant="primary"
          size="sm"
          loading={isSaving}
          disabled={!isDirty || errors.length > 0}
          onClick={handleSave}
        >
          {isDirty ? 'Uložit' : 'Uloženo'}
        </AdminButton>
      </div>
    </div>
  );
}
