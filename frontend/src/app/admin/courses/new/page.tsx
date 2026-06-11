'use client';

import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { CourseCreateForm } from '@/components/admin/course-create/CourseCreateForm';

export default function NewCoursePage() {
  const { isLoading } = useRequireAdmin();
  if (isLoading) return null;

  return (
    <AdminPageLayout
      title="Nový kurz"
      maxWidth="sm"
      breadcrumb={[
        { label: 'Kurzy', href: '/admin/courses' },
        { label: 'Nový kurz' },
      ]}
    >
      <CourseCreateForm />
    </AdminPageLayout>
  );
}
