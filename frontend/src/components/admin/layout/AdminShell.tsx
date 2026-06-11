'use client';

import { useEffect } from 'react';
import { useSidebarStore } from '@/lib/stores/sidebar.store';
import { useThemeStore } from '@/lib/stores/theme.store';
import { AdminTopBar } from './AdminTopBar';
import { AdminSidebar } from './AdminSidebar';
import { AdminErrorBoundary } from '@/components/admin/common/AdminErrorBoundary';
import { ToastContainer } from '@/components/admin/common/ToastContainer';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebarStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="admin-root">
      <AdminTopBar />
      <AdminSidebar />
      <main
        className="admin-main"
        style={{ marginLeft: isExpanded ? '240px' : '64px' }}
      >
        <AdminErrorBoundary>
          {children}
        </AdminErrorBoundary>
      </main>
      <ToastContainer />
    </div>
  );
}
