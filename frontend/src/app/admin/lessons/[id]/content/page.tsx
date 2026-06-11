'use client';

import { useEffect, use } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { fetchBlocks, fetchLessonInfo } from '@/lib/lesson-content/lesson-content.api';
import { useLessonContentStore } from '@/lib/lesson-content/lesson-content.store';
import { BlocksListToolbar } from '@/components/admin/lesson-content/BlocksListToolbar';
import { BlocksSortableList } from '@/components/admin/lesson-content/BlocksSortableList';
import { BlockDrawer } from '@/components/admin/lesson-content/block-drawer/BlockDrawer';
import { AddBlockModal } from '@/components/admin/lesson-content/add-block-modal/AddBlockModal';
import { DeleteBlockModal } from '@/components/admin/lesson-content/delete-block-modal/DeleteBlockModal';

export default function LessonContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading } = useRequireAdmin();
  const { setBlocks } = useLessonContentStore();

  useEffect(() => {
    Promise.all([fetchBlocks(id), fetchLessonInfo(id)]).then(([blocks, info]) => {
      setBlocks(blocks, id, info.lessonTitle, info.courseId, info.courseTitle);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) return null;

  return (
    <div className="flex flex-col">
      <BlocksListToolbar />
      <div className="p-admin-2xl">
        <BlocksSortableList />
      </div>
      <BlockDrawer />
      <AddBlockModal />
      <DeleteBlockModal />
    </div>
  );
}
