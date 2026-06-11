'use client';

/**
 * Course vocabulary page for the user (cards grouped by lesson).
 */

import { use, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRequireUser } from '@/lib/user-auth/user-auth.hooks';
import { fetchCourseVocabulary, UserVocabWord } from '@/lib/user-auth/user-lesson.api';
import { fetchMyCourses } from '@/lib/user-auth/user-courses.api';
import { UserTopBar } from '@/components/user/UserTopBar';
import { VocabularyCard } from '@/components/user/VocabularyCard';

export default function CourseVocabularyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  const { isLoading } = useRequireUser();

  const { data: courses } = useQuery({ queryKey: ['user-courses'], queryFn: fetchMyCourses, enabled: !isLoading });
  const { data: words, isLoading: isVocabLoading } = useQuery({
    queryKey: ['user-course-vocab', courseId],
    queryFn: () => fetchCourseVocabulary(courseId),
    enabled: !isLoading,
  });

  const course = courses?.find((c) => c.courseId === courseId);

  const groups = useMemo(() => {
    const map = new Map<string, UserVocabWord[]>();
    (words ?? []).forEach((w) => {
      const key = w.lessonTitle ?? 'Ostatní';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(w);
    });
    return Array.from(map.entries());
  }, [words]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-admin-bg">
      <UserTopBar />
      <main className="user-page max-w-5xl mx-auto px-admin-lg py-admin-xl">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-admin-sm text-admin-text-muted hover:text-admin-text transition-colors mb-admin-lg"
        >
          <i className="ti ti-arrow-left text-[14px]" /> Zpět na lekce
        </Link>

        <div className="flex items-center gap-3 mb-admin-lg">
          <div className="w-10 h-10 rounded-admin-md flex items-center justify-center shadow-admin-md" style={{ background: course?.thumbnailColor ?? 'var(--color-admin-primary)' }}>
            <i className="ti ti-vocabulary text-white text-[20px]" />
          </div>
          <div>
            <h1 className="text-admin-xl font-extrabold text-admin-text">Slovní zásoba</h1>
            <p className="text-admin-sm text-admin-text-muted">{course?.title ?? 'Kurz'} · {words?.length ?? 0} slovíček</p>
          </div>
        </div>

        {isVocabLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-admin-md">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="admin-card h-32 animate-pulse" />)}
          </div>
        )}

        {!isVocabLoading && (!words || words.length === 0) && (
          <div className="admin-card p-admin-2xl text-center text-admin-text-muted">
            <i className="ti ti-vocabulary-off text-[36px] block mb-2" />
            Tento kurz zatím nemá žádná slovíčka.
          </div>
        )}

        <div className="flex flex-col gap-admin-xl">
          {groups.map(([lessonTitle, lessonWords]) => (
            <section key={lessonTitle}>
              <h2 className="text-admin-sm font-bold text-admin-text-muted uppercase tracking-wide mb-admin-md flex items-center gap-2">
                <i className="ti ti-book" /> {lessonTitle}
                <span className="text-admin-xs font-medium normal-case">({lessonWords.length})</span>
              </h2>
              <div className="user-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-admin-md">
                {lessonWords.map((w) => <VocabularyCard key={w.id} word={w} />)}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
