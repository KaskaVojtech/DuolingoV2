'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalLessonsStore } from '@/lib/global-lessons/global-lessons.store';
import { useLessonStats } from '@/lib/global-lessons/global-lessons.api';
import { useLessons, saveLessonAsTemplate } from '@/lib/global-lessons/global-lessons.api';
import { useUIStore } from '@/lib/stores/ui.store';
import { SlideDrawer } from '@/components/admin/common/SlideDrawer';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { LessonStatsOverview } from './stats/LessonStatsOverview';
import { LessonCompletionChart } from './stats/LessonCompletionChart';
import { LessonUserFilter } from './stats/LessonUserFilter';
import { LessonExerciseStatsTable } from './stats/LessonExerciseStatsTable';
import { LessonContentBlockStats } from './stats/LessonContentBlockStats';
import { LessonCourseBadges } from './LessonCourseBadges';

type Tab = 'stats' | 'settings' | 'exercises' | 'content';

export function LessonDetailPanel() {
  const { isDetailOpen, selectedLessonId, closeDetail, filter } = useGlobalLessonsStore();
  const { data: lessonsData } = useLessons(filter);
  const lesson = lessonsData?.items.find((l) => l.id === selectedLessonId);
  const { data: stats, isLoading: statsLoading } = useLessonStats(selectedLessonId);
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const router = useRouter();
  const { showToast } = useUIStore();

  const handleSaveAsTemplate = async () => {
    if (!lesson) return;
    setIsSavingTemplate(true);
    try {
      await saveLessonAsTemplate(lesson.id);
      showToast('Lekce uložena jako šablona', 'success');
    } catch {
      showToast('Nepodařilo se uložit šablonu', 'error');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'stats', label: 'Statistiky' },
    { key: 'settings', label: 'Nastavení' },
    { key: 'exercises', label: 'Cvičení' },
    { key: 'content', label: 'Obsahové bloky' },
  ];

  return (
    <SlideDrawer isOpen={isDetailOpen} onClose={closeDetail} title={lesson?.title ?? 'Detail lekce'} width={560}>
      {lesson && (
        <div className="flex flex-col h-full">

          <div className="px-admin-lg pb-admin-md">
            <AdminButton
              icon="ti-arrow-right"
              onClick={() => router.push(`/admin/lessons/${lesson.id}/content`)}
            >
              Upravit obsah lekce
            </AdminButton>
          </div>

          <div className="flex border-b border-admin-border px-admin-lg mb-admin-lg">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-admin-md py-2 text-admin-xs font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.key ? 'border-admin-primary text-admin-text' : 'border-transparent text-admin-text-muted hover:text-admin-text'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-admin-lg pb-admin-lg">
            {activeTab === 'stats' && (
              <div className="flex flex-col gap-admin-lg">
                {statsLoading && <p className="text-admin-sm text-admin-text-muted">Načítám statistiky...</p>}
                {stats && (
                  <>
                    <LessonStatsOverview stats={stats} />
                    <LessonCompletionChart stats={stats} />
                    <LessonUserFilter lessonId={lesson.id} />
                  </>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="flex flex-col gap-admin-lg">
                <div>
                  <p className="text-admin-xs text-admin-text-muted mb-1">Přítomnost v kurzech</p>
                  <LessonCourseBadges courseIds={lesson.courseIds} courseTitles={lesson.courseTitles} linkable />
                </div>
                <div>
                  <p className="text-admin-xs text-admin-text-muted mb-1">Šablona</p>
                  {lesson.isTemplate ? (
                    <p className="text-admin-sm text-admin-text flex items-center gap-2">
                      <i className="ti ti-info-circle text-admin-primary" aria-hidden="true" />
                      Tato lekce je šablona — lze ji importovat do více kurzů
                    </p>
                  ) : (
                    <AdminButton
                      variant="ghost"
                      icon="ti-template"
                      loading={isSavingTemplate}
                      onClick={handleSaveAsTemplate}
                    >
                      Uložit jako šablonu
                    </AdminButton>
                  )}
                </div>
                <div>
                  <p className="text-admin-xs text-admin-text-muted mb-1">Stav zamknutí</p>
                  <p className="text-admin-sm text-admin-text">
                    {lesson.lockMode === 'toggle' ? (lesson.isLocked ? 'Zamčeno' : 'Odemčeno')
                    : lesson.lockMode === 'scheduled' ? 'Časové zamknutí'
                    : 'Podmíněné zamknutí'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'exercises' && (
              statsLoading
                ? <p className="text-admin-sm text-admin-text-muted">Načítám...</p>
                : stats ? <LessonExerciseStatsTable stats={stats} />
                : null
            )}

            {activeTab === 'content' && (
              statsLoading
                ? <p className="text-admin-sm text-admin-text-muted">Načítám...</p>
                : stats ? <LessonContentBlockStats stats={stats} />
                : null
            )}
          </div>
        </div>
      )}
    </SlideDrawer>
  );
}
