'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLessonUsers } from '@/lib/global-lessons/global-lessons.api';
import { QUERY_KEYS } from '@/lib/shared/query-keys';
import { formatRelativeDate } from '@/lib/global-lessons/global-lessons.utils';

interface Props { lessonId: string }

export function LessonUserFilter({ lessonId }: Props) {
  const [minPercent, setMinPercent] = useState(0);
  const [maxPercent, setMaxPercent] = useState(100);
  const [applied, setApplied] = useState({ min: 0, max: 100 });

  const { data: users, isLoading } = useQuery({
    queryKey: QUERY_KEYS.lessonUsers(lessonId, applied),
    queryFn: () => fetchLessonUsers(lessonId, applied.min, applied.max),
  });

  return (
    <div>
      <p className="text-admin-xs text-admin-text-muted mb-admin-sm">Zobrazit uživatele kteří dosáhli:</p>
      <div className="flex items-center gap-admin-sm mb-admin-sm">
        <span className="text-admin-xs text-admin-text-muted">Od</span>
        <input
          type="number" min={0} max={100}
          className="w-16 bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text text-center"
          value={minPercent}
          onChange={(e) => setMinPercent(Number(e.target.value))}
        />
        <span className="text-admin-xs text-admin-text-muted">% do</span>
        <input
          type="number" min={0} max={100}
          className="w-16 bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text text-center"
          value={maxPercent}
          onChange={(e) => setMaxPercent(Number(e.target.value))}
        />
        <span className="text-admin-xs text-admin-text-muted">%</span>
        <button
          onClick={() => setApplied({ min: minPercent, max: maxPercent })}
          className="px-admin-sm py-1 text-admin-xs text-admin-primary border border-admin-primary rounded-admin-sm hover:bg-admin-primary hover:text-white transition-colors"
        >
          Filtrovat
        </button>
      </div>

      {isLoading && <p className="text-admin-xs text-admin-text-muted">Načítám...</p>}
      {users && users.length === 0 && <p className="text-admin-xs text-admin-text-muted italic">Žádní uživatelé v daném rozsahu.</p>}
      {users && users.length > 0 && (
        <div className="border border-admin-border rounded-admin-sm overflow-hidden">
          {users.map((user) => (
            <div key={user.userId} className="flex items-center gap-admin-md px-admin-md py-2 border-b border-admin-border last:border-0 text-admin-xs">
              <span className="flex-1 text-admin-text truncate">{user.email}</span>
              <span className="text-admin-text-muted">{user.completionPercent}%</span>
              <span className="text-admin-text-muted">{user.lastActivityAt ? formatRelativeDate(user.lastActivityAt) : '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
