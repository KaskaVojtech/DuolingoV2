'use client';

import { useRequireAdmin, useAuth } from '@/lib/auth/auth.hooks';
import { decodeJwtPayload } from '@/lib/auth/auth.utils';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { DashboardGrid } from '@/components/admin/dashboard/DashboardGrid';

export default function DashboardPage() {
  const { isLoading } = useRequireAdmin();
  const { accessToken } = useAuth();

  if (isLoading) return null;

  const payload = accessToken ? decodeJwtPayload(accessToken) : null;
  const email = typeof payload?.email === 'string' ? payload.email : 'Administrátor';

  return (
    <AdminPageLayout title={`Dobrý den, ${email}`}>
      <DashboardGrid />
    </AdminPageLayout>
  );
}
