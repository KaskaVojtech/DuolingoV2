'use client';

/**
 * Course page for the user: list of lessons with locks and completion state.
 */

import { use } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireUser } from '@/lib/user-auth/user-auth.hooks';
import { fetchCourseLessons, fetchMyCourses, completeLesson, uncompleteLesson, UserLesson } from '@/lib/user-auth/user-courses.api';
import { UserTopBar } from '@/components/user/UserTopBar';

function LockBadge({ lesson }: { lesson: UserLesson }) {
  if (!lesson.isLocked) {
    return <span className="flex items-center gap-1 text-admin-xs text-[#2db868]"><i className="ti ti-lock-open text-[14px]" /> Odemčeno</span>;
  }
  if (lesson.lockMode === 'scheduled') {
    const unlockAt = lesson.unlockAt ? new Date(lesson.unlockAt) : null;
    const lockAt = lesson.lockAt ? new Date(lesson.lockAt) : null;
    const now = new Date();
    if (unlockAt && now < unlockAt) {
      const date = unlockAt.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
      const time = unlockAt.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
      return <span className="flex items-center gap-1 text-admin-xs text-[#f59e0b]"><i className="ti ti-clock text-[14px]" /> Odemkne se {date} {time}</span>;
    }
    if (lockAt && now > lockAt) {
      return <span className="flex items-center gap-1 text-admin-xs text-admin-text-muted"><i className="ti ti-lock text-[14px]" /> Uzavřeno</span>;
    }
  }
  if (lesson.lockMode === 'constraint') {
    return <span className="flex items-center gap-1 text-admin-xs text-[#a855f7]"><i className="ti ti-lock text-[14px]" /> Splňte předchozí lekce</span>;
  }
  return <span className="flex items-center gap-1 text-admin-xs text-admin-text-muted"><i className="ti ti-lock text-[14px]" /> Zamčeno</span>;
}

function CompletionButton({ lesson, courseId }: { lesson: UserLesson; courseId: string }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['user-lessons', courseId] });

  const complete = useMutation({ mutationFn: () => completeLesson(lesson.id), onSuccess: invalidate });
  const uncomplete = useMutation({ mutationFn: () => uncompleteLesson(lesson.id), onSuccess: invalidate });

  if (!lesson.completionMode) return null;

  if (lesson.isLocked) {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-admin-sm text-admin-xs font-semibold text-admin-text-muted border border-admin-border cursor-not-allowed opacity-60 shrink-0">
        <i className="ti ti-circle-check text-[14px]" /> Dokončit
      </span>
    );
  }

  if (lesson.isCompleted) {
    return (
      <button onClick={() => uncomplete.mutate()} disabled={uncomplete.isPending} title="Kliknutím odznačit"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-admin-sm text-admin-xs font-semibold text-[#2db868] border border-[#1a5c30] bg-[#0f2a1a] hover:bg-[#0f3320] transition-colors shrink-0">
        <i className="ti ti-circle-check text-[14px]" /> Dokončeno
      </button>
    );
  }

  if (lesson.completionMode === 'blocks_completion') {
    const { mandatoryBlocksTotal, mandatoryBlocksDone, blocksAllDone } = lesson;
    if (mandatoryBlocksTotal === 0) return null;
    if (blocksAllDone) {
      return (
        <button onClick={() => complete.mutate()} disabled={complete.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-admin-sm text-admin-xs font-semibold text-[#2db868] border border-[#2db868] bg-[#0f2a1a] hover:bg-[#0f3320] transition-colors shrink-0">
          <i className="ti ti-circle-check text-[14px]" /> Označit jako splněnou
        </button>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-admin-xs text-admin-text-muted shrink-0">
        <i className="ti ti-circle-dashed text-[14px]" />{mandatoryBlocksDone}/{mandatoryBlocksTotal} bloků
      </span>
    );
  }

  return (
    <button onClick={() => complete.mutate()} disabled={complete.isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-admin-sm text-admin-xs font-semibold text-admin-text border border-admin-primary bg-admin-surface-2 hover:bg-admin-surface transition-colors shrink-0">
      <i className="ti ti-circle-check text-[14px]" /> Dokončit lekci
    </button>
  );
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  const { isLoading } = useRequireUser();

  const { data: courses } = useQuery({ queryKey: ['user-courses'], queryFn: fetchMyCourses, enabled: !isLoading });
  const { data: lessons, isLoading: isLessonsLoading } = useQuery({
    queryKey: ['user-lessons', courseId],
    queryFn: () => fetchCourseLessons(courseId),
    enabled: !isLoading,
  });

  if (isLoading) return null;

  const course = courses?.find((c) => c.courseId === courseId);
  const color = course?.thumbnailColor ?? 'var(--color-admin-primary)';

  const unlockedCount = lessons?.filter((l) => !l.isLocked).length ?? 0;
  const completedCount = lessons?.filter((l) => l.isCompleted).length ?? 0;
  const totalCount = lessons?.length ?? 0;

  return (
    <div className="min-h-screen bg-admin-bg">
      <UserTopBar />

      <main className="user-page max-w-2xl mx-auto px-admin-lg py-admin-xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-admin-sm text-admin-text-muted hover:text-admin-text transition-colors mb-admin-lg">
          <i className="ti ti-arrow-left text-[14px]" /> Zpět na kurzy
        </Link>

        <div className="admin-card overflow-hidden mb-admin-lg">
          <div className="user-hero h-24 flex items-center justify-between px-admin-lg" style={{ background: color }}>
            <div className="relative z-[1]">
              <h1 className="text-admin-xl font-extrabold text-white">{course?.title ?? 'Kurz'}</h1>
              {course?.description && <p className="text-admin-sm text-white/70 mt-0.5">{course.description}</p>}
            </div>
            <Link href={`/courses/${courseId}/vocabulary`}
              className="relative z-[1] flex items-center gap-1.5 px-3 py-2 rounded-admin-sm bg-white/15 hover:bg-white/25 hover:-translate-y-px text-white text-admin-sm font-semibold transition-all shrink-0">
              <i className="ti ti-vocabulary text-[16px]" /> Slovíčka
            </Link>
          </div>
          <div className="px-admin-lg py-admin-sm flex items-center gap-admin-lg text-admin-xs text-admin-text-muted">
            <span><i className="ti ti-list mr-1" />{totalCount} lekcí</span>
            {completedCount > 0 && <span className="text-[#2db868]"><i className="ti ti-circle-check mr-1" />{completedCount} splněno</span>}
            <span><i className="ti ti-lock-open mr-1 text-[#2db868]" />{unlockedCount} odemčeno</span>
            {totalCount - unlockedCount > 0 && <span><i className="ti ti-lock mr-1" />{totalCount - unlockedCount} zamčeno</span>}
          </div>
        </div>

        <div className="user-stagger flex flex-col">
          {isLessonsLoading && (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 admin-card animate-pulse" />)}
            </div>
          )}

          {!isLessonsLoading && lessons?.length === 0 && (
            <div className="text-center py-12">
              <i className="ti ti-book-off text-[32px] text-admin-text-muted block mb-2" />
              <p className="text-admin-sm text-admin-text-muted">Kurz zatím neobsahuje žádné lekce</p>
            </div>
          )}

          {lessons?.map((lesson, idx) => (
            <div key={lesson.id}
              className={`flex items-center gap-admin-md px-admin-md py-admin-md border-b border-admin-border last:border-b-0 first:rounded-t-admin-lg last:rounded-b-admin-lg bg-admin-surface ${lesson.isLocked ? 'opacity-60' : ''}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-admin-xs font-bold shrink-0"
                style={{
                  background: lesson.isCompleted ? '#0f2a1a' : lesson.isLocked ? 'var(--color-admin-surface-2)' : color + '33',
                  color: lesson.isCompleted ? '#2db868' : lesson.isLocked ? 'var(--color-admin-text-muted)' : color,
                  border: `1px solid ${lesson.isCompleted ? '#1a5c30' : lesson.isLocked ? 'var(--color-admin-border)' : color + '66'}`,
                }}>
                {lesson.isCompleted ? <i className="ti ti-check text-[13px]" /> : idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                {lesson.isLocked ? (
                  <p className="text-admin-sm font-semibold truncate text-admin-text-muted">{lesson.title}</p>
                ) : (
                  <Link href={`/courses/${courseId}/lessons/${lesson.id}`}
                    className={`text-admin-sm font-semibold truncate block hover:underline ${lesson.isCompleted ? 'text-[#2db868]' : 'text-admin-text'}`}>
                    {lesson.title}
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-admin-md shrink-0">
                {lesson.isLocked && <LockBadge lesson={lesson} />}
                <CompletionButton lesson={lesson} courseId={courseId} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
