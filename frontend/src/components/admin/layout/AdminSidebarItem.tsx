'use client';

import Link from 'next/link';
import { useSidebarStore } from '@/lib/stores/sidebar.store';
import { SidebarItem } from '@/lib/dashboard/tiles.config';

interface AdminSidebarItemProps {
  item: SidebarItem;
  isActive: boolean;
}

export function AdminSidebarItem({ item, isActive }: AdminSidebarItemProps) {
  const { isExpanded } = useSidebarStore();

  return (
    <Link
      href={item.href}
      title={!isExpanded ? item.label : undefined}
      className={`admin-sidebar__link flex items-center gap-3 px-4 py-2.5 relative ${
        isActive
          ? 'admin-sidebar__link--active text-admin-sidebar-text-active'
          : 'text-admin-sidebar-text hover:text-admin-sidebar-text-active'
      }`}
    >
      <i
        className={`ti ${item.icon} text-[20px] shrink-0 admin-sidebar__icon ${isActive ? 'text-admin-primary' : 'text-admin-sidebar-icon'}`}
        aria-hidden="true"
      />
      <span
        className="admin-sidebar__item-text text-admin-sm font-bold"
        style={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
      >
        {item.label}
      </span>
    </Link>
  );
}
