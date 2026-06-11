'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LessonNavTabsProps {
  lessonId: string;
}

const TABS = [
  { label: 'Obsah',        href: (id: string) => `/admin/lessons/${id}/content`,    icon: 'ti-layout-list' },
  { label: 'Slovíčka',     href: (id: string) => `/admin/lessons/${id}/vocabulary`, icon: 'ti-vocabulary' },
  { label: 'Procvičování', href: (id: string) => `/admin/lessons/${id}/practice`,   icon: 'ti-brain' },
];

export function LessonNavTabs({ lessonId }: LessonNavTabsProps) {
  const pathname = usePathname();

  return (
    <nav className="lesson-nav-tabs" aria-label="Sekce lekce">
      {TABS.map((tab) => {
        const href = tab.href(lessonId);
        const isActive = pathname === href;
        return (
          <Link
            key={tab.label}
            href={href}
            className={`lesson-nav-tabs__tab ${isActive ? 'lesson-nav-tabs__tab--active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <i className={`ti ${tab.icon}`} aria-hidden="true" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
