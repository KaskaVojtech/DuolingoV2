'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { useUIStore } from '@/lib/stores/ui.store';
import { AdminButton } from '@/components/admin/common/AdminButton';

interface Props {
  courseTitle: string;
  lessonTitle: string;
  courseId: string;
  lessonId: string;
}

export function ContentEditorTopBar({ courseTitle, lessonTitle, courseId, lessonId }: Props) {
  const { content, isDirty, isSaving, previewMode, setTitle, saveContent, togglePreview } = useContentEditorStore();
  const canSave = !!content.id;
  const { showToast } = useUIStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [titleVal, setTitleVal] = useState(content.title);

  useEffect(() => { setTitleVal(content.title); }, [content.id]);

  const handleTitleChange = (v: string) => {
    setTitleVal(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setTitle(v), 800);
  };

  const handleSave = async () => {
    try {
      await saveContent();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Chyba při ukládání', 'error');
    }
  };

  return (
    <div className={`flex items-center gap-admin-md px-admin-lg h-[56px] bg-toolbar-bg border-b border-toolbar-border sticky top-0 z-30${previewMode ? '' : ' mr-[300px]'}`}>

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
          placeholder="Název obsahu..."
        />
        {isDirty && <span className="text-admin-xs text-admin-text-muted shrink-0">●</span>}
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex border border-admin-border rounded-admin-sm overflow-hidden">
          {(['editor', 'preview'] as const).map((mode) => {
            const active = mode === 'preview' ? previewMode : !previewMode;
            return (
              <button key={mode} type="button"
                onClick={() => { if ((mode === 'preview') !== previewMode) togglePreview(); }}
                className={`px-admin-md py-1 text-admin-xs font-medium transition-colors ${active ? 'bg-admin-primary text-white' : 'text-admin-text-muted hover:text-admin-text'}`}
              >{mode === 'editor' ? 'Editor' : 'Preview'}</button>
            );
          })}
        </div>
      </div>

      <AdminButton
        variant="primary"
        loading={isSaving}
        disabled={!canSave}
        icon="ti-device-floppy"
        onClick={handleSave}
      >
        Uložit
      </AdminButton>
    </div>
  );
}
