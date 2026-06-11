'use client';

import { useSidebarStore } from '@/lib/stores/sidebar.store';
import { AdminSidebarToggle } from './AdminSidebarToggle';
import { AdminSidebarSection } from './AdminSidebarSection';
import { SIDEBAR_SECTIONS } from '@/lib/dashboard/tiles.config';

export function AdminSidebar() {
  const { isExpanded } = useSidebarStore();

  return (
    <nav
      className="admin-sidebar fixed left-0 top-[56px] h-[calc(100vh-56px)] z-40 bg-admin-sidebar-bg border-r border-admin-sidebar-border flex flex-col overflow-hidden"
      style={{ width: isExpanded ? '240px' : '64px' }}
      aria-label="Administrace navigace"
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {SIDEBAR_SECTIONS.map((section) => (
          <AdminSidebarSection key={section.title} section={section} />
        ))}
      </div>
      <AdminSidebarToggle />
    </nav>
  );
}
