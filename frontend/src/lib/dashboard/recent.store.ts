/**
 * Zustand store of recently visited items for the dashboard.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentState {
  accessCounts: Record<string, number>;
  recentIds: string[];
  recordVisit: (tileId: string) => void;
  getTopTiles: (n: number) => string[];
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      accessCounts: {},
      recentIds: [],
      recordVisit: (tileId) =>
        set((s) => {
          const counts = { ...s.accessCounts, [tileId]: (s.accessCounts[tileId] ?? 0) + 1 };
          const recent = [tileId, ...s.recentIds.filter((id) => id !== tileId)].slice(0, 10);
          return { accessCounts: counts, recentIds: recent };
        }),
      getTopTiles: (n) => {
        const { accessCounts } = get();
        return Object.entries(accessCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, n)
          .map(([id]) => id);
      },
    }),
    { name: 'admin-recent-tiles' }
  )
);
