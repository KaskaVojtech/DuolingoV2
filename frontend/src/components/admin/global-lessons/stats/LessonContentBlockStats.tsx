import { LessonStats } from '@/lib/global-lessons/global-lessons.types';
import { formatDuration } from '@/lib/global-lessons/global-lessons.utils';

interface Props { stats: LessonStats }

export function LessonContentBlockStats({ stats }: Props) {
  if (stats.contentBlockStats.length === 0) {
    return <p className="text-admin-sm text-admin-text-muted italic">Lekce nemá žádné obsahové bloky.</p>;
  }

  return (
    <div>
      <table className="w-full text-admin-sm mb-admin-md">
        <thead>
          <tr>
            {['Název bloku', 'Průměr čtení', 'Medián čtení', 'Zobrazení', 'Potvrzení'].map((h) => (
              <th key={h} className="text-left px-admin-md py-2 text-admin-xs text-admin-text-muted font-medium border-b border-admin-border">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats.contentBlockStats.map((b) => (
            <tr key={b.blockId} className="hover:bg-admin-sidebar-hover">
              <td className="px-admin-md py-2 border-b border-admin-border text-admin-text">{b.blockTitle}</td>
              <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted">{formatDuration(b.averageReadTime)}</td>
              <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted">{formatDuration(b.medianReadTime)}</td>
              <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted">{b.viewCount}</td>
              <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted">
                {b.readConfirmationRate > 0 ? `${b.readConfirmationRate}%` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-admin-xs text-admin-text-muted italic">
        Čas čtení je měřen jako doba od zobrazení bloku do opuštění nebo kliknutí na další blok.
      </p>
    </div>
  );
}
