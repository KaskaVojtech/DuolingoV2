'use client';

import { useEffect, useState } from 'react';
import { UsersApi } from '@/lib/api/users.api';
import { UserCourse } from '@/lib/types/lesson.types';

export default function DashboardPage() {
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<UserCourse | null>(null);

  useEffect(() => {
    UsersApi.getMyCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home-hero" style={{ justifyContent: 'flex-start', paddingTop: '8rem' }}>
      <p className="home-tag">Můj profil</p>

      {!selectedCourse ? (
        <>
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
                  onClick={() => setSelectedCourse(userCourse)}
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
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <button
              className="vocab-btn vocab-btn-edit"
              onClick={() => setSelectedCourse(null)}
            >
              ← Zpět
            </button>
            <h1 className="home-heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', margin: 0 }}>
              {selectedCourse.course.title}
            </h1>
          </div>

          <div className="dashboard-lessons-grid" style={{ marginTop: '2rem', width: '100%' }}>
            {selectedCourse.course.courseLessons?.map((cl) => (
              <div
                key={cl.lesson.id}
                className={`dashboard-lesson-card ${!cl.isUnlocked ? 'dashboard-lesson-card--locked' : ''}`}
              >
                {cl.isUnlocked ? (
                  <>
                    <div className="dashboard-lesson-card-icon">📖</div>
                    <h3 className="dashboard-lesson-card-title">{cl.lesson.title}</h3>
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
        </>
      )}
    </main>
  );
} 