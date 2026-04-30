'use client';

import { useEffect, useState } from 'react';
import { UsersApi } from '@/lib/api/users.api';
import { UserCourse } from '@/lib/types/lesson.types';
import LessonGamesScreen from '@/components/games/LessonGamesScreen';

type Screen =
  | { type: 'courses' }
  | { type: 'lessons'; course: UserCourse }
  | { type: 'games'; course: UserCourse; lessonId: number; lessonTitle: string };

export default function DashboardPage() {
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>({ type: 'courses' });

  useEffect(() => {
    UsersApi.getMyCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  // ── GAME SCREEN ──────────────────────────────────────────────────────────────
  if (screen.type === 'games') {
    return (
      <main className="home-hero" style={{ justifyContent: 'flex-start', paddingTop: '8rem' }}>
        <LessonGamesScreen
          lessonId={screen.lessonId}
          lessonTitle={screen.lessonTitle}
          onBack={() => setScreen({ type: 'lessons', course: screen.course })}
        />
      </main>
    );
  }

  // ── LESSON LIST SCREEN ───────────────────────────────────────────────────────
  if (screen.type === 'lessons') {
    const uc = screen.course;
    return (
      <main className="home-hero" style={{ justifyContent: 'flex-start', paddingTop: '8rem' }}>
        <p className="home-tag">Můj profil</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <button
            className="vocab-btn vocab-btn-edit"
            onClick={() => setScreen({ type: 'courses' })}
          >
            ← Zpět
          </button>
          <h1 className="home-heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', margin: 0 }}>
            {uc.course.title}
          </h1>
        </div>

        <div className="dashboard-lessons-grid" style={{ marginTop: '2rem', width: '100%' }}>
          {uc.course.courseLessons?.map((cl) => (
            <div
              key={cl.lesson.id}
              className={`dashboard-lesson-card ${!cl.isUnlocked ? 'dashboard-lesson-card--locked' : 'dashboard-lesson-card--clickable'}`}
              onClick={
                cl.isUnlocked
                  ? () =>
                      setScreen({
                        type: 'games',
                        course: uc,
                        lessonId: cl.lesson.id,
                        lessonTitle: cl.lesson.title,
                      })
                  : undefined
              }
              role={cl.isUnlocked ? 'button' : undefined}
              tabIndex={cl.isUnlocked ? 0 : undefined}
              onKeyDown={
                cl.isUnlocked
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        setScreen({
                          type: 'games',
                          course: uc,
                          lessonId: cl.lesson.id,
                          lessonTitle: cl.lesson.title,
                        });
                    }
                  : undefined
              }
            >
              {cl.isUnlocked ? (
                <>
                  <div className="dashboard-lesson-card-icon">📖</div>
                  <h3 className="dashboard-lesson-card-title">{cl.lesson.title}</h3>
                  <span className="dashboard-lesson-card-cta">Cvičit →</span>
                </>
              ) : (
                <>
                  <div className="dashboard-lesson-card-icon">🔒</div>
                  <h3 className="dashboard-lesson-card-title">{cl.lesson.title}</h3>
                  <p className="dashboard-lesson-card-locked">Zamčeno</p>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    );
  }

  // ── COURSE LIST SCREEN ───────────────────────────────────────────────────────
  return (
    <main className="home-hero" style={{ justifyContent: 'flex-start', paddingTop: '8rem' }}>
      <p className="home-tag">Můj profil</p>

      <h1 className="home-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        Moje kurzy
      </h1>

      {loading && (
        <p style={{ color: 'var(--gray)', marginTop: '2rem' }}>Načítání...</p>
      )}

      {!loading && courses.length === 0 && (
        <p style={{ color: 'var(--gray)', marginTop: '2rem' }}>
          Zatím nemáte přiřazeny žádné kurzy. Kontaktujte administrátora.
        </p>
      )}

      {!loading && courses.length > 0 && (
        <div className="admin-cards-grid" style={{ marginTop: '2rem', width: '100%' }}>
          {courses.map((userCourse) => (
            <button
              key={userCourse.course.id}
              className="dashboard-course-card"
              onClick={() => setScreen({ type: 'lessons', course: userCourse })}
            >
              <div className="dashboard-course-card-icon">🎓</div>
              <h3 className="dashboard-course-card-title">{userCourse.course.title}</h3>
              <p className="dashboard-course-card-meta">
                {userCourse.course.courseLessons?.length ?? 0} lekcí
              </p>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
