'use client';

import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { CoursesSearchInput } from './CoursesSearchInput';
import { ViewModeSwitcher } from './ViewModeSwitcher';
export function CoursesToolbar() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-admin-md px-admin-lg h-[56px] bg-toolbar-bg border-b border-toolbar-border sticky top-[56px] z-30">
      <AdminButton icon="ti-plus" onClick={() => router.push('/admin/courses/new')}>
        Nový kurz
      </AdminButton>

      <div className="flex-1 flex justify-center">
        <CoursesSearchInput />
      </div>

      <div className="flex items-center gap-admin-sm">
        <ViewModeSwitcher />
      </div>
    </div>
  );
}
