import { LessonStats } from '@/lib/global-lessons/global-lessons.types';

interface Props { stats: LessonStats }

export function LessonStatsOverview({ stats }: Props) {
  const { completionStats: cs } = stats;
  return (
    <div>
      <div className="flex gap-admin-md mb-admin-md">
        {[
          { label: 'Průměr', value: `${cs.average} %` },
          { label: 'Medián', value: `${cs.median} %` },
          { label: 'Modus', value: `${cs.mode} %` },
        ].map(({ label, value }) => (
          <div key={label} className="stat-card">
            <div className="stat-card__value">{value}</div>
            <div className="stat-card__label">{label} dokončenosti</div>
          </div>
        ))}
      </div>
      <div className="flex gap-admin-lg text-admin-sm text-admin-text-muted">
        <span>Celkem uživatelů: <strong className="text-admin-text">{cs.totalUsers}</strong></span>
        <span>Dokončilo 100%: <strong className="text-admin-text">{cs.completedUsers} ({cs.totalUsers > 0 ? Math.round(cs.completedUsers / cs.totalUsers * 100) : 0}%)</strong></span>
      </div>
    </div>
  );
}
