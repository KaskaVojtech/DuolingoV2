import { useMemo } from 'react';
import { ALL_TILES } from '@/lib/dashboard/tiles.config';
import { assignTileSizes, fisherYatesShuffle, TileWithSize } from '@/lib/dashboard/tiles.utils';
import { useRecentStore } from '@/lib/dashboard/recent.store';

export function useDashboardTiles(): TileWithSize[] {
  const { accessCounts, recentIds } = useRecentStore();

  return useMemo(() => {
    let ordered = recentIds.length === 0
      ? fisherYatesShuffle([...ALL_TILES])
      : [...ALL_TILES].sort((a, b) => (accessCounts[b.id] ?? 0) - (accessCounts[a.id] ?? 0));

    return assignTileSizes(ordered.slice(0, Math.min(ordered.length, 8)));
  }, [accessCounts, recentIds]);
}
