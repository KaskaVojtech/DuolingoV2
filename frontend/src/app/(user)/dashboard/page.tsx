'use client';

/**
 * User dashboard: overview of their courses and adding a course via an access code.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRequireUser } from '@/lib/user-auth/user-auth.hooks';
import { fetchMyCourses, joinCourse, UserCourse } from '@/lib/user-auth/user-courses.api';
import { UserTopBar } from '@/components/user/UserTopBar';

function CourseCard({ course }: { course: UserCourse }) {
  const color = course.thumbnailColor || 'var(--color-admin-primary)';
  const initials = course.title.slice(0, 2).toUpperCase();

  return (
    <Link href={`/courses/${course.courseId}`} className="admin-card user-tile overflow-hidden block group">
      <div className="h-28 flex items-center justify-center" style={{ background: color }}>
        {course.thumbnailUrl ? (

          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-admin-2xl font-extrabold text-white/80">{initials}</span>
        )}
      </div>
      <div className="p-admin-md">
        <h3 className="text-admin-sm font-bold text-admin-text line-clamp-2">{course.title}</h3>
        {course.description && <p className="text-admin-xs text-admin-text-muted mt-1 line-clamp-2">{course.description}</p>}
        <p className="text-admin-xs text-admin-primary mt-2 flex items-center gap-1 font-semibold">
          Zobrazit lekce <i className="ti ti-arrow-right text-[11px]" />
        </p>
      </div>
    </Link>
  );
}

function JoinCourseModal({ onClose, onJoined }: { onClose: () => void; onJoined: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true); setError('');
    try {
      await joinCourse(code.trim().toUpperCase());
      setSuccess(true);
      onJoined();
      setTimeout(onClose, 1200);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message ?? e?.message ?? 'Neplatný kód');
    } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 admin-fade-in" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="admin-card admin-scale-in w-full max-w-sm p-admin-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-admin-base font-bold text-admin-text mb-1">Přidat kurz kódem</h2>
        <p className="text-admin-xs text-admin-text-muted mb-admin-lg">Zadejte přístupový kód který jste obdrželi</p>
        {success ? (
          <div className="text-center py-3">
            <i className="ti ti-circle-check text-[32px] text-[#2db868] block mb-2" />
            <p className="text-admin-sm text-admin-text">Kurz byl přidán!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-admin-md">
            <input
              autoFocus type="text" value={code} onChange={(e) => setCode(e.target.value)}
              placeholder="Přístupový kód"
              className="admin-field uppercase tracking-widest text-center"
              maxLength={50}
            />
            {error && <p className="text-admin-xs text-admin-danger">{error}</p>}
            <div className="flex gap-2 mt-1">
              <button type="button" onClick={onClose} className="admin-btn admin-btn--ghost admin-btn--md flex-1">Zrušit</button>
              <button type="submit" disabled={!code.trim() || loading} className="admin-btn admin-btn--primary admin-btn--md flex-1">
                {loading ? 'Přidávám…' : 'Přidat kurz'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isLoading } = useRequireUser();
  const [showJoin, setShowJoin] = useState(false);

  const { data: courses, isLoading: isCoursesLoading, refetch } = useQuery({
    queryKey: ['user-courses'],
    queryFn: fetchMyCourses,
    enabled: !isLoading,
  });

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-admin-bg">
      <UserTopBar />

      <main className="user-page max-w-4xl mx-auto px-admin-lg py-admin-xl">
        <div className="flex items-center justify-between mb-admin-lg">
          <div>
            <h1 className="text-admin-xl font-extrabold text-admin-text">Moje kurzy</h1>
            <p className="text-admin-sm text-admin-text-muted mt-0.5">Kurzy ke kterým máte přístup</p>
          </div>
          <button onClick={() => setShowJoin(true)} className="admin-btn admin-btn--primary admin-btn--md">
            <i className="ti ti-plus text-[14px]" /> Přidat kódem
          </button>
        </div>

        {isCoursesLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-admin-md">
            {[1, 2, 3].map((i) => <div key={i} className="admin-card h-44 animate-pulse" />)}
          </div>
        )}

        {!isCoursesLoading && (!courses || courses.length === 0) && (
          <div className="admin-card p-admin-2xl text-center">
            <i className="ti ti-book-off text-[40px] text-admin-text-muted block mb-3" />
            <p className="text-admin-text font-bold mb-1">Zatím žádné kurzy</p>
            <p className="text-admin-sm text-admin-text-muted mb-admin-md">Přidejte kurz pomocí přístupového kódu</p>
            <button onClick={() => setShowJoin(true)} className="admin-btn admin-btn--primary admin-btn--md">Zadat kód</button>
          </div>
        )}

        {courses && courses.length > 0 && (
          <div className="user-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-admin-md">
            {courses.map((course) => <CourseCard key={course.courseId} course={course} />)}
          </div>
        )}
      </main>

      {showJoin && <JoinCourseModal onClose={() => setShowJoin(false)} onJoined={() => refetch()} />}
    </div>
  );
}
