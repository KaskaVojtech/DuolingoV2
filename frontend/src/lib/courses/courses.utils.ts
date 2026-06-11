import { Course } from './courses.types';

export function filterCourses(courses: Course[], query: string): Course[] {
  if (!query.trim()) return courses;
  const q = query.toLowerCase();
  return courses.filter(
    (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );
}

export function formatUpdatedAt(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'Dnes';
  if (diffDays === 1) return 'Včera';
  if (diffDays < 7) return `Před ${diffDays} dny`;

  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
}
