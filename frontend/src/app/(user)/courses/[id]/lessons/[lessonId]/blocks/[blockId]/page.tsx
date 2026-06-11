'use client';

/**
 * Detail of a single lesson block for the user (content / exercise / games) with navigation between blocks.
 */

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRequireUser } from '@/lib/user-auth/user-auth.hooks';
import { fetchLessonContent } from '@/lib/user-auth/user-lesson.api';
import { UserTopBar } from '@/components/user/UserTopBar';
import { LessonBlock } from '@/components/user/lesson/LessonBlock';

export default function BlockDetailPage({ params }: { params: Promise<{ id: string; lessonId: string; blockId: string }> }) {
  const { id: courseId, lessonId, blockId } = use(params);
  const { isLoading } = useRequireUser();

  const { data: lesson, isLoading: isLessonLoading } = useQuery({
    queryKey: ['user-lesson-content', lessonId],
    queryFn: () => fetchLessonContent(lessonId),
    enabled: !isLoading,
  });

  if (isLoading) return null;

  const blocks = lesson?.blocks ?? [];
  const idx = blocks.findIndex((b) => b.id === blockId);
  const block = idx >= 0 ? blocks[idx] : null;

  const nextBlock = blocks.slice(idx + 1).find((b) => !b.isLocked);

  const lessonHref = `/courses/${courseId}/lessons/${lessonId}`;

  return (
    <div className="min-h-screen bg-admin-bg">
      <UserTopBar />
      <main className="user-page max-w-3xl mx-auto px-admin-lg py-admin-xl">
        <Link href={lessonHref} className="inline-flex items-center gap-1.5 text-admin-sm text-admin-text-muted hover:text-admin-text transition-colors mb-admin-lg">
          <i className="ti ti-arrow-left text-[14px]" /> {lesson?.title ?? 'Zpět na lekci'}
        </Link>

        {isLessonLoading && <div className="admin-card h-64 animate-pulse" />}

        {!isLessonLoading && !block && (
          <div className="admin-card p-admin-2xl text-center">
            <i className="ti ti-alert-triangle text-[32px] text-admin-danger block mb-2" />
            <p className="text-admin-text font-semibold">Blok nenalezen</p>
            <Link href={lessonHref} className="admin-btn admin-btn--ghost admin-btn--md mt-admin-md inline-flex">Zpět na lekci</Link>
          </div>
        )}

        {block && block.isLocked && (
          <div className="admin-card p-admin-2xl text-center">
            <i className="ti ti-lock text-[32px] text-admin-text-muted block mb-2" />
            <p className="text-admin-text font-semibold">Tento blok je zamčený</p>
            <Link href={lessonHref} className="admin-btn admin-btn--ghost admin-btn--md mt-admin-md inline-flex">Zpět na lekci</Link>
          </div>
        )}

        {block && !block.isLocked && (
          <>
            <LessonBlock block={block} lessonId={lessonId} />

            <div className="mt-admin-xl flex items-center justify-between gap-admin-md">
              <Link href={lessonHref} className="admin-btn admin-btn--ghost admin-btn--md">
                <i className="ti ti-list" /> Přehled lekce
              </Link>
              {nextBlock && (
                <Link href={`/courses/${courseId}/lessons/${lessonId}/blocks/${nextBlock.id}`} className="admin-btn admin-btn--primary admin-btn--md">
                  Další blok <i className="ti ti-arrow-right" />
                </Link>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
