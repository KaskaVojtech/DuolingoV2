'use client';

import { useEffect, useState } from 'react';
import { UsersApi } from '@/lib/api/users.api';
import { UserCourse } from '@/lib/types/lesson.types';
import Link from 'next/link';

export default function DashboardPage() {
  const [courses, setCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    UsersApi.getMyCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

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
          {courses.map(({ course }) => (
            <div key={course.id} className="admin-dashboard-card">
              <div className="admin-dashboard-card-icon">🎓</div>
              <h3>{course.title}</h3>
              {course.description && (
                <p>{course.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}