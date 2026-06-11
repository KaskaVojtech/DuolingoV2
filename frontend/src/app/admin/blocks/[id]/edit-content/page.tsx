'use client';

import { use, useEffect } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { fetchBlockContent } from '@/lib/content-editor/content-editor.api';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';
import { ContentEditor } from '@/components/admin/content-editor/ContentEditor';

export default function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading } = useRequireAdmin();
  const { setContent, content } = useContentEditorStore();

  useEffect(() => {
    fetchBlockContent(id).then((c) => setContent(c));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) return null;

  return <ContentEditor lessonId={content.lessonId} />;
}
