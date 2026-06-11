'use client';

/**
 * Lesson page for the user: list of blocks and lesson completion.
 */

import { use } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireUser } from '@/lib/user-auth/user-auth.hooks';
import { fetchLessonContent } from '@/lib/user-auth/user-lesson.api';
import { completeLesson, uncompleteLesson } from '@/lib/user-auth/user-courses.api';
import { UserTopBar } from '@/components/user/UserTopBar';
import { LessonBlockCard } from '@/components/user/lesson/LessonBlockCard';

export default function LessonPlayerPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id: courseId, lessonId } = use(params);
  const { isLoading } = useRequireUser();
  const qc = useQueryClient();

  const { data: lesson, isLoading: isLessonLoading, isError } = useQuery({
    queryKey: ['user-lesson-content', lessonId],
    queryFn: () => fetchLessonContent(lessonId),
    enabled: !isLoading,
  });

  const complete = useMutation({
    mutationFn: () => completeLesson(lessonId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-lessons', courseId] });
      qc.invalidateQueries({ queryKey: ['user-progress'] });
    },
  });
  const uncomplete = useMutation({
    mutationFn: () => uncompleteLesson(lessonId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user-lessons', courseId] }),
  });

  if (isLoading) return null;

  const color = lesson?.courseColor ?? 'var(--color-admin-primary)';
  const blocks = lesson?.blocks ?? [];
  const completedBlocks = blocks.filter((b) => b.isCompleted).length;

  return (
    <div className="min-h-screen bg-admin-bg">
      <UserTopBar />

      <main className="user-page max-w-3xl mx-auto px-admin-lg py-admin-xl">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-admin-sm text-admin-text-muted hover:text-admin-text transition-colors mb-admin-lg"
        >
          <i className="ti ti-arrow-left text-[14px]" /> Zpět na lekce
        </Link>

        {isLessonLoading && (
          <div className="space-y-admin-md">
            {[1, 2, 3].map((i) => <div key={i} className="admin-card h-40 animate-pulse" />)}
          </div>
        )}

        {isError && (
          <div className="admin-card p-admin-xl text-center">
            <i className="ti ti-alert-triangle text-[32px] text-admin-danger block mb-2" />
            <p className="text-admin-text font-semibold">Lekci se nepodařilo načíst</p>
            <p className="text-admin-sm text-admin-text-muted mt-1">Možná k ní nemáte přístup nebo je zamčená.</p>
          </div>
        )}

        {lesson && (
          <>

            <div className="admin-card overflow-hidden mb-admin-lg">
              <div className="user-hero px-admin-lg py-admin-md flex items-center justify-between" style={{ background: color }}>
                <div className="relative z-[1]">
                  <p className="text-white/70 text-admin-xs font-semibold uppercase tracking-wide">{lesson.courseTitle}</p>
                  <h1 className="text-admin-xl font-extrabold text-white">{lesson.title}</h1>
                </div>
                <Link
                  href={`/courses/${courseId}/lessons/${lessonId}/practice`}
                  className="relative z-[1] flex items-center gap-1.5 px-3 py-2 rounded-admin-sm bg-white/15 hover:bg-white/25 hover:-translate-y-px text-white text-admin-sm font-semibold transition-all shrink-0"
                >
                  <i className="ti ti-barbell text-[16px]" /> Procvičovat
                </Link>
              </div>
              <div className="px-admin-lg py-admin-sm flex items-center gap-admin-lg text-admin-xs text-admin-text-muted bg-admin-surface">
                <span><i className="ti ti-stack-2 mr-1" />{blocks.length} bloků</span>
                {completedBlocks > 0 && (
                  <span className="text-[#2db868]"><i className="ti ti-circle-check mr-1" />{completedBlocks} dokončeno</span>
                )}
              </div>
            </div>

            <div className="user-stagger flex flex-col gap-admin-sm">
              {blocks.length === 0 && (
                <div className="admin-card p-admin-xl text-center text-admin-text-muted">
                  <i className="ti ti-mood-empty text-[32px] block mb-2" />
                  Lekce zatím nemá žádný obsah.
                </div>
              )}
              {blocks.map((block) => (
                <LessonBlockCard
                  key={block.id}
                  block={block}
                  href={`/courses/${courseId}/lessons/${lessonId}/blocks/${block.id}`}
                />
              ))}
            </div>

            {blocks.length > 0 && (
              <div className="mt-admin-xl flex justify-center">
                {complete.isSuccess ? (
                  <button
                    onClick={() => { uncomplete.mutate(); complete.reset(); }}
                    disabled={uncomplete.isPending}
                    className="admin-btn admin-btn--ghost admin-btn--md"
                  >
                    <i className="ti ti-circle-check-filled text-[#2db868]" /> Lekce dokončena — odznačit
                  </button>
                ) : (
                  <button
                    onClick={() => complete.mutate()}
                    disabled={complete.isPending}
                    className="admin-btn admin-btn--primary admin-btn--md"
                  >
                    <i className="ti ti-circle-check" /> Označit lekci jako dokončenou
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
