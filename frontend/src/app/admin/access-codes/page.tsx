'use client';

import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { CodesPanel } from '@/components/admin/access/CodesPanel';
import { UserAccessPanel } from '@/components/admin/access/UserAccessPanel';

export default function AccessPage() {
  const { isLoading } = useRequireAdmin();
  if (isLoading) return null;

  return (
    <AdminPageLayout title="Přístupy" maxWidth="lg">
      <p className="text-admin-sm text-admin-text-muted mb-admin-lg -mt-admin-sm max-w-[680px]">
        Přístup ke kurzům se přiděluje skupinám a jednotlivým uživatelům. Skupinám přiřazuješ kurzy
        na detailu skupiny; tady spravuješ přístupové kódy a individuální přístup uživatelů.
      </p>
      <div className="flex flex-col gap-admin-xl">
        <CodesPanel />
        <UserAccessPanel />
      </div>
    </AdminPageLayout>
  );
}
