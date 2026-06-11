'use client';

import { use, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { createBlockContent } from '@/lib/content-editor/content-editor.api';
import { useContentEditorStore } from '@/lib/content-editor/content-editor.store';

export default function NewContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: lessonId } = use(params);
  const { isLoading } = useRequireAdmin();
  const router = useRouter();
  const { setContent } = useContentEditorStore();
  const hasCreated = useRef(false);

  useEffect(() => {
    if (hasCreated.current) return;
    hasCreated.current = true;
    createBlockContent(lessonId).then((c) => {
      setContent(c);
      router.replace(`/admin/blocks/${c.id}/edit-content`);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  if (isLoading) return null;

  return null;
}
