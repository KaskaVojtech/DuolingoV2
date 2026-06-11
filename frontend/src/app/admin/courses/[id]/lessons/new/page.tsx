'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import apiClient from '@/lib/shared/api-client';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { AdminInput } from '@/components/admin/common/AdminInput';
import { AdminButton } from '@/components/admin/common/AdminButton';

export default function NewLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  const { isLoading } = useRequireAdmin();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Název lekce je povinný'); return; }
    setIsPending(true);
    setError('');
    try {
      await apiClient.post(`/courses/${courseId}/lessons`, { title: title.trim() });
      router.push(`/admin/courses/${courseId}/lessons`);
    } catch {
      setError('Nepodařilo se vytvořit lekci. Zkuste to prosím znovu.');
    } finally {
      setIsPending(false);
    }
  };

  if (isLoading) return null;

  return (
    <AdminPageLayout
      title="Nová lekce"
      breadcrumb={[
        { label: 'Kurzy', href: '/admin/courses' },
        { label: 'Lekce kurzu', href: `/admin/courses/${courseId}/lessons` },
        { label: 'Nová lekce' },
      ]}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-admin-lg">
        <AdminInput
          label="Název lekce *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Zadejte název lekce..."
          autoFocus
          error={error}
        />
        <div className="flex gap-admin-sm">
          <AdminButton type="submit" variant="primary" loading={isPending} icon="ti-plus">
            Vytvořit lekci
          </AdminButton>
          <AdminButton
            type="button"
            variant="ghost"
            onClick={() => router.push(`/admin/courses/${courseId}/lessons`)}
          >
            Zrušit
          </AdminButton>
        </div>
      </form>
    </AdminPageLayout>
  );
}
