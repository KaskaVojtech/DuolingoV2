'use client';

/**
 * User progress page: earned XP, completed lessons and progress per course.
 */

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRequireUser } from '@/lib/user-auth/user-auth.hooks';
import { fetchProgress } from '@/lib/user-auth/user-lesson.api';
import { UserTopBar } from '@/components/user/UserTopBar';

function StatCard({ icon, value, label, color }: { icon: string; value: number | string; label: string; color: string }) {
  return (
    <div className="admin-card user-tile p-admin-lg flex items-center gap-admin-md">
      <div className="w-12 h-12 rounded-admin-md flex items-center justify-center shrink-0 shadow-admin-md" style={{ background: color }}>
        <i className={`ti ${icon} text-white text-[24px]`} />
      </div>
      <div>
        <p className="user-stat-value text-admin-2xl font-extrabold text-admin-text leading-none">{value}</p>
        <p className="text-admin-sm text-admin-text-muted mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { isLoading } = useRequireUser();
  const { data, isLoading: isProgressLoading } = useQuery({
    queryKey: ['user-progress'],
    queryFn: fetchProgress,
    enabled: !isLoading,
  });

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-admin-bg">
      <UserTopBar />
      <main className="user-page max-w-4xl mx-auto px-admin-lg py-admin-xl">
        <h1 className="text-admin-xl font-extrabold text-admin-text mb-admin-lg">Můj pokrok</h1>

        {isProgressLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-admin-md">
            {[1, 2, 3].map((i) => <div key={i} className="admin-card h-24 animate-pulse" />)}
          </div>
        )}

        {data && (
          <>
            <div className="user-stagger grid grid-cols-1 sm:grid-cols-3 gap-admin-md mb-admin-xl">
              <StatCard icon="ti-bolt" value={data.totalXp} label="Celkem XP" color="#f59e0b" />
              <StatCard icon="ti-circle-check" value={data.completedLessons} label="Dokončených lekcí" color="#2db868" />
              <StatCard icon="ti-stack-2" value={data.completedBlocks} label="Dokončených bloků" color="#5b7cfa" />
            </div>

            <h2 className="text-admin-base font-bold text-admin-text mb-admin-md">Kurzy</h2>
            <div className="user-stagger flex flex-col gap-admin-md">
              {data.courses.length === 0 && (
                <div className="admin-card p-admin-xl text-center text-admin-text-muted">
                  Zatím žádné kurzy.
                </div>
              )}
              {data.courses.map((c) => {
                const pct = c.totalLessons > 0 ? Math.round((c.completedLessons / c.totalLessons) * 100) : 0;
                const cColor = c.thumbnailColor || 'var(--color-admin-primary)';
                return (
                  <Link key={c.courseId} href={`/courses/${c.courseId}`} className="admin-card user-tile p-admin-lg block">
                    <div className="flex items-center justify-between mb-admin-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-admin-sm shrink-0 shadow-admin-sm" style={{ background: cColor }} />
                        <span className="text-admin-base font-bold text-admin-text">{c.title}</span>
                      </div>
                      <div className="flex items-center gap-admin-md text-admin-sm text-admin-text-muted">
                        <span className="flex items-center gap-1 text-[#f59e0b]"><i className="ti ti-bolt" />{c.earnedXp}</span>
                        <span>{c.completedLessons}/{c.totalLessons} lekcí</span>
                      </div>
                    </div>
                    <div className="h-2.5 rounded-full bg-admin-surface-2 overflow-hidden">
                      <div className="user-progress h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: cColor }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
