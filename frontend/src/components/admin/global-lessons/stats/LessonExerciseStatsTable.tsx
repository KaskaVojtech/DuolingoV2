'use client';

import { useState } from 'react';
import { LessonStats } from '@/lib/global-lessons/global-lessons.types';
import { successRateColor } from '@/lib/global-lessons/global-lessons.utils';

interface Props { stats: LessonStats }

export function LessonExerciseStatsTable({ stats }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (stats.exerciseStats.length === 0) {
    return <p className="text-admin-sm text-admin-text-muted italic">Lekce nemá žádná cvičení.</p>;
  }

  return (
    <table className="lessons-table w-full text-admin-sm">
      <thead>
        <tr>
          {['Název cvičení', 'Pokusů', 'Unikátních', 'Úspěšnost', 'Skóre', 'Opakování'].map((h) => (
            <th key={h} className="text-left px-admin-md py-2 text-admin-xs text-admin-text-muted font-medium border-b border-admin-border">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {stats.exerciseStats.map((ex) => (
          <>
            <tr
              key={ex.blockId}
              className="cursor-pointer hover:bg-admin-sidebar-hover"
              onClick={() => setExpanded(expanded === ex.blockId ? null : ex.blockId)}
            >
              <td className="px-admin-md py-2 border-b border-admin-border">
                <div className="flex items-center gap-2">
                  <i className={`ti ti-chevron-${expanded === ex.blockId ? 'down' : 'right'} text-[12px] text-admin-text-muted`} aria-hidden="true" />
                  <span className="text-admin-text">{ex.blockTitle}</span>
                  {ex.isMandatory && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-block-exercise-bg border border-block-exercise-border text-block-exercise-primary">povinné</span>
                  )}
                </div>
              </td>
              <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted">{ex.attemptCount}</td>
              <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted">{ex.uniqueUsers}</td>
              <td className="px-admin-md py-2 border-b border-admin-border">
                <span style={{ color: successRateColor(ex.successRate) }}>{ex.successRate}%</span>
              </td>
              <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted">{ex.averageScore}</td>
              <td className="px-admin-md py-2 border-b border-admin-border text-admin-text-muted">{ex.repeatRate.toFixed(1)}×</td>
            </tr>
            {expanded === ex.blockId && ex.itemStats?.map((item) => (
              <tr key={item.itemId} className="bg-admin-surface-2">
                <td className="pl-[48px] pr-admin-md py-1.5 border-b border-admin-border text-admin-xs text-admin-text-muted">
                  ├─ {item.itemType}
                </td>
                <td className="px-admin-md py-1.5 border-b border-admin-border text-admin-xs text-admin-text-muted">{item.attemptCount}</td>
                <td className="px-admin-md py-1.5 border-b border-admin-border text-admin-xs text-admin-text-muted">—</td>
                <td className="px-admin-md py-1.5 border-b border-admin-border text-admin-xs">
                  <span style={{ color: successRateColor(item.successRate) }}>{item.successRate}%</span>
                </td>
                <td colSpan={2} />
              </tr>
            ))}
          </>
        ))}
      </tbody>
    </table>
  );
}
