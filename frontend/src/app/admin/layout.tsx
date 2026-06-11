'use client';

/**
 * Administration layout with the shared arrangement (sidebar, content).
 */

import { usePathname } from 'next/navigation';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/shared/query-client';
import { AdminShell } from '@/components/admin/layout/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <QueryClientProvider client={queryClient}>
      {isLoginPage ? children : <AdminShell>{children}</AdminShell>}
    </QueryClientProvider>
  );
}
