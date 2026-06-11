'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LessonStats } from '@/lib/global-lessons/global-lessons.types';

interface Props { stats: LessonStats }

export function LessonCompletionChart({ stats }: Props) {
  const data = stats.completionStats.distribution.map((d) => ({
    name: `${d.bucket}%`,
    count: d.count,
  }));

  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#8c91bd', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis tick={{ fill: '#8c91bd', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#161829', border: '1px solid #2c2e4d', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#e8eaf2' }}
            itemStyle={{ color: '#5b7cfa' }}
          />
          <Bar dataKey="count" fill="#5b7cfa" radius={[3, 3, 0, 0]} name="Uživatelů" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
