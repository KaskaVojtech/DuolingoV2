'use client';

import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/lib/stores/sidebar.store';
import { AdminSidebarItem } from './AdminSidebarItem';
import { SidebarSection } from '@/lib/dashboard/tiles.config';

interface AdminSidebarSectionProps {
  section: SidebarSection;
}

export function AdminSidebarSection({ section }: AdminSidebarSectionProps) {
  const { isExpanded } = useSidebarStore();
  const pathname = usePathname();

  const activeHref = section.items
    .filter((i) => pathname === i.href || pathname.startsWith(i.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <div className="mb-2">
      {isExpanded ? (
        <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-admin-sidebar-section">
          {section.title}
        </p>
      ) : (
        <hr className="mx-3 my-2 border-admin-sidebar-border" />
      )}
      {section.items.map((item) => (
        <AdminSidebarItem key={item.id} item={item} isActive={item.href === activeHref} />
      ))}
    </div>
  );
}
