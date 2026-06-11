'use client';

import { useEffect, useRef, useState } from 'react';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { fetchLessonInfo } from '@/lib/lesson-content/lesson-content.api';
import { ContentEditorTopBar } from './ContentEditorTopBar';
import { BlockList } from './BlockList';
import { ContentSidebar } from './sidebar/ContentSidebar';
import { ContentPreview } from './preview/ContentPreview';

interface Props { lessonId: string }

export function ContentEditor({ lessonId }: Props) {
  const { content, previewMode, isDirty } = useContentEditorStore();
  const [meta, setMeta] = useState({ courseTitle: '', lessonTitle: '', courseId: '' });
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  useEffect(() => {
    if (lessonId) fetchLessonInfo(lessonId).then((info) =>
      setMeta({ courseTitle: info.courseTitle, lessonTitle: info.lessonTitle, courseId: info.courseId })
    );
  }, [lessonId]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  return (
    <div className="content-editor">
      <ContentEditorTopBar
        courseTitle={meta.courseTitle}
        lessonTitle={meta.lessonTitle}
        courseId={meta.courseId}
        lessonId={lessonId}
      />
      {previewMode ? (
        <div className="content-editor__canvas">
          <ContentPreview blocks={content.blocks} />
        </div>
      ) : (
        <>
          <div className="content-editor__canvas">
            <BlockList onSelectionChange={setSavedRange} />
          </div>
          <ContentSidebar savedRange={savedRange} />
        </>
      )}
    </div>
  );
}
