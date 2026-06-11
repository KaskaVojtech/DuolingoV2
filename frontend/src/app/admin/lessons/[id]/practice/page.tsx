'use client';

import { use, useState } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import {
  usePracticeConfig,
  useTogglePracticeEnabled,
  useTogglePracticeType,
  useRegeneratePractice,
} from '@/lib/practice/practice.api';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { LessonNavTabs } from '@/components/admin/common/LessonNavTabs';
import { PracticePageHeader } from '@/components/admin/practice/PracticePageHeader';
import { PracticeFilterBar } from '@/components/admin/practice/PracticeFilterBar';
import { PracticeCategory } from '@/components/admin/practice/PracticeCategory';
import { PracticeTypeConfig } from '@/lib/practice/practice.types';

export default function PracticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading } = useRequireAdmin();
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  const { data: config, isLoading: isConfigLoading } = usePracticeConfig(id);
  const toggleMaster = useTogglePracticeEnabled(id);
  const toggleType = useTogglePracticeType(id);
  const regenerate = useRegeneratePractice(id);

  if (isLoading || isConfigLoading || !config) return null;

  function handleToggleType(type: PracticeTypeConfig['type'], enabled: boolean) {
    toggleType.mutate({ type, enabled });
  }

  return (
    <AdminPageLayout
      title="Procvičování"
      breadcrumb={[
        { label: 'Kurzy', href: '/admin/courses' },
        { label: 'Lekce', href: `/admin/lessons/${id}/content` },
        { label: 'Procvičování' },
      ]}
    >
      <LessonNavTabs lessonId={id} />
      <PracticePageHeader
        config={config}
        onToggleMaster={(enabled) => toggleMaster.mutate(enabled)}
        onRegenerate={() => regenerate.mutate()}
        isRegenerating={regenerate.isPending}
      />

      <PracticeFilterBar active={filter} onChange={setFilter} />

      <PracticeCategory
        category="vocabulary"
        types={config.types}
        activeFilter={filter}
        isPracticeEnabled={config.isPracticeEnabled}
        onToggleType={handleToggleType}
      />
      <PracticeCategory
        category="sentences"
        types={config.types}
        activeFilter={filter}
        isPracticeEnabled={config.isPracticeEnabled}
        onToggleType={handleToggleType}
      />
      <PracticeCategory
        category="listening"
        types={config.types}
        activeFilter={filter}
        isPracticeEnabled={config.isPracticeEnabled}
        onToggleType={handleToggleType}
      />
    </AdminPageLayout>
  );
}
