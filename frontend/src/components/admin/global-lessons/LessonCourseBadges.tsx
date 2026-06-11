import Link from 'next/link';

interface Props {
  courseIds: string[];
  courseTitles: string[];
  linkable?: boolean;
}

export function LessonCourseBadges({ courseIds, courseTitles, linkable = false }: Props) {
  if (courseIds.length === 0) {
    return <span className="course-badge course-badge--standalone">Bez kurzu</span>;
  }

  const visible = courseTitles.slice(0, 3);
  const extra = courseTitles.length - 3;

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((title, idx) => (
        linkable ? (
          <Link key={courseIds[idx]} href={`/admin/courses/${courseIds[idx]}/lessons`} className="course-badge hover:border-admin-primary transition-colors">
            {title}
          </Link>
        ) : (
          <span key={courseIds[idx]} className="course-badge">{title}</span>
        )
      ))}
      {extra > 0 && <span className="course-badge">+{extra} další</span>}
    </div>
  );
}
