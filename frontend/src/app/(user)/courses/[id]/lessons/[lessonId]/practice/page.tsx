'use client';

/**
 * Lesson practice page for the user: choosing a type and starting a practice session.
 */

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRequireUser } from '@/lib/user-auth/user-auth.hooks';
import { fetchLessonPractice, PracticeType } from '@/lib/user-auth/user-lesson.api';
import { UserTopBar } from '@/components/user/UserTopBar';
import { PRACTICE_META } from '@/lib/user-practice/practice.types';
import { isTypeAvailable, generateQuestions, generatePairs } from '@/lib/user-practice/practice-generator';
import { PracticeSession } from '@/components/user/practice/PracticeSession';
import { MemoryGame, MatchGame } from '@/components/user/practice/BoardGames';

export default function PracticePage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id: courseId, lessonId } = use(params);
  const { isLoading } = useRequireUser();
  const [active, setActive] = useState<PracticeType | null>(null);

  const { data, isLoading: isPracticeLoading } = useQuery({
    queryKey: ['user-lesson-practice', lessonId],
    queryFn: () => fetchLessonPractice(lessonId),
    enabled: !isLoading,
  });

  const available = useMemo(() => {
    if (!data) return [];
    return data.enabledTypes.filter((t) => isTypeAvailable(t, data.words));
  }, [data]);

  const session = useMemo(() => {
    if (!active || !data) return null;
    const m = PRACTICE_META[active];
    if (m.mode === 'sequential') return { mode: m.mode, questions: generateQuestions(active, data.words) };
    return { mode: m.mode, pairs: generatePairs(data.words) };
  }, [active, data]);

  if (isLoading) return null;

  const meta = active ? PRACTICE_META[active] : null;

  return (
    <div className="min-h-screen bg-admin-bg">
      <UserTopBar />
      <main className="user-page max-w-5xl mx-auto px-admin-lg py-admin-xl">
        {!active && (
          <>
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}`}
              className="inline-flex items-center gap-1.5 text-admin-sm text-admin-text-muted hover:text-admin-text transition-colors mb-admin-lg"
            >
              <i className="ti ti-arrow-left text-[14px]" /> Zpět na lekci
            </Link>

            <div className="flex items-center gap-3 mb-admin-lg">
              <div className="user-icon-badge w-10 h-10 rounded-admin-md flex items-center justify-center">
                <i className="ti ti-barbell text-white text-[20px]" />
              </div>
              <div>
                <h1 className="text-admin-xl font-extrabold text-admin-text">Procvičování</h1>
                <p className="text-admin-sm text-admin-text-muted">{data?.lessonTitle ?? ''} · {data?.words.length ?? 0} slovíček</p>
              </div>
            </div>

            {isPracticeLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-admin-md">
                {[1, 2, 3, 4].map((i) => <div key={i} className="admin-card h-28 animate-pulse" />)}
              </div>
            )}

            {!isPracticeLoading && data && !data.isPracticeEnabled && (
              <div className="admin-card p-admin-2xl text-center text-admin-text-muted">
                <i className="ti ti-lock text-[36px] block mb-2" />
                Procvičování není pro tuto lekci povoleno.
              </div>
            )}

            {!isPracticeLoading && data?.isPracticeEnabled && available.length === 0 && (
              <div className="admin-card p-admin-2xl text-center text-admin-text-muted">
                <i className="ti ti-mood-empty text-[36px] block mb-2" />
                Pro procvičování zatím není dost slovíček (nebo chybí audio/věty).
              </div>
            )}

            {data?.isPracticeEnabled && available.length > 0 && (
              <div className="user-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-admin-md">
                {available.map((t) => {
                  const m = PRACTICE_META[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setActive(t)}
                      className="admin-card user-tile p-admin-lg text-left flex items-start gap-admin-md"
                    >
                      <div className="w-10 h-10 rounded-admin-md flex items-center justify-center shrink-0 shadow-admin-sm" style={{ background: m.color }}>
                        <i className={`ti ${m.icon} text-white text-[20px]`} />
                      </div>
                      <div>
                        <p className="text-admin-base font-bold text-admin-text">{m.label}</p>
                        <p className="text-admin-sm text-admin-text-muted">{m.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {active && meta && session && (
          <div className="pt-admin-md">
            {session.mode === 'sequential' && (
              <PracticeSession questions={session.questions} label={meta.label} color={meta.color} onExit={() => setActive(null)} />
            )}
            {session.mode === 'memory' && (
              <MemoryGame pairs={session.pairs} label={meta.label} color={meta.color} onExit={() => setActive(null)} />
            )}
            {session.mode === 'match' && (
              <MatchGame pairs={session.pairs} label={meta.label} color={meta.color} onExit={() => setActive(null)} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
