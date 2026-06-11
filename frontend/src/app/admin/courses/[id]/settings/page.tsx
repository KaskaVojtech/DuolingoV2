'use client';

import { useEffect, use } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { fetchCourseSettings } from '@/lib/course-settings/course-settings.api';
import { useCourseSettingsStore } from '@/lib/course-settings/course-settings.store';
import { AdminPageLayout } from '@/components/admin/common/AdminPageLayout';
import { CourseAppearanceSection } from '@/components/admin/course-settings/CourseAppearanceSection';
import { DeleteCourseModal } from '@/components/admin/course-settings/shared/DeleteCourseModal';
import { useUIStore } from '@/lib/stores/ui.store';
import { useCourseSettingsStore as useStore } from '@/lib/course-settings/course-settings.store';

function SectionCard({ icon, title, subtitle, children }: { icon: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-admin-surface border border-admin-border rounded-admin-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-admin-border flex items-center gap-3">
        <span className="w-8 h-8 rounded-admin-sm bg-admin-surface-2 border border-admin-border flex items-center justify-center shrink-0">
          <i className={`ti ${icon} text-admin-text-muted text-[15px]`} />
        </span>
        <div>
          <h2 className="text-admin-sm font-semibold text-admin-text">{title}</h2>
          {subtitle && <p className="text-admin-xs text-admin-text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-6 py-5">
        {children}
      </div>
    </div>
  );
}

function DangerSection({ courseId }: { courseId: string }) {
  const openModal = useUIStore((s) => s.openModal);
  const { courseTitle } = useStore();
  return (
    <div className="border border-admin-danger/20 rounded-admin-lg overflow-hidden bg-admin-danger-bg">
      <div className="px-6 py-4 border-b border-admin-danger/20 flex items-center gap-3">
        <span className="w-8 h-8 rounded-admin-sm bg-admin-surface border border-admin-danger/30 flex items-center justify-center shrink-0">
          <i className="ti ti-alert-triangle text-admin-danger text-[15px]" />
        </span>
        <div>
          <h2 className="text-admin-sm font-semibold text-admin-danger">Nebezpečná zóna</h2>
          <p className="text-admin-xs text-admin-text-muted mt-0.5">Nevratné operace</p>
        </div>
      </div>
      <div className="px-6 py-5">
        <p className="text-admin-sm text-admin-text-muted mb-4">
          Smazání kurzu je nevratná akce. Budou odstraněny všechny lekce, bloky obsahu a přístupy studentů.
        </p>
        <button
          onClick={() => openModal('deleteCourse', { courseId, courseTitle })}
          className="flex items-center gap-2 px-4 py-2 bg-admin-danger/10 text-admin-danger border border-admin-danger/30 rounded-admin-sm text-admin-sm font-medium hover:bg-admin-danger hover:text-white hover:border-admin-danger transition-all"
        >
          <i className="ti ti-trash text-[14px]" />
          Smazat kurz
        </button>
      </div>
    </div>
  );
}

export default function CourseSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading } = useRequireAdmin();
  const store = useCourseSettingsStore();

  useEffect(() => {
    fetchCourseSettings(id).then((s) => {
      store.initCourse(s.courseId, s.courseTitle, s.visibility, s.thumbnailColor, s.thumbnailUrl);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading || !store.courseId) return null;

  return (
    <AdminPageLayout
      maxWidth="md"
      title="Nastavení kurzu"
      breadcrumb={[
        { label: 'Kurzy', href: '/admin/courses' },
        { label: store.courseTitle, href: `/admin/courses/${id}/lessons` },
        { label: 'Nastavení' },
      ]}
    >
      <div className="flex flex-col gap-4">
        <SectionCard icon="ti-palette" title="Vzhled kurzu" subtitle="Název a náhledový obrázek">
          <CourseAppearanceSection courseId={id} />
        </SectionCard>

        <div className="text-admin-sm text-admin-text-muted bg-admin-surface border border-admin-border rounded-admin-lg px-6 py-4 flex items-start gap-3">
          <i className="ti ti-info-circle text-admin-primary text-[18px] mt-0.5 shrink-0" />
          <span>
            Přístup ke kurzu se teď spravuje centrálně v sekci{' '}
            <a href="/admin/access-codes" className="text-admin-primary font-bold hover:underline">Přístupy</a>
            {' '}(kódy a jednotliví uživatelé) a na detailu skupiny (přiřazení kurzů skupinám).
          </span>
        </div>

        <DangerSection courseId={id} />
      </div>

      <DeleteCourseModal />
    </AdminPageLayout>
  );
}
