import { TileDefinition } from './tiles.config';

export type TileSize = 'small' | 'medium' | 'large' | 'tall' | 'wide';

export interface TileWithSize extends TileDefinition {
  size: TileSize;
}

export const TILE_GRID_MAP: Record<TileSize, { colSpan: number; rowSpan: number }> = {
  small:  { colSpan: 1, rowSpan: 1 },
  medium: { colSpan: 2, rowSpan: 1 },
  large:  { colSpan: 2, rowSpan: 2 },
  tall:   { colSpan: 1, rowSpan: 2 },
  wide:   { colSpan: 3, rowSpan: 1 },
};

const SIZE_SEQUENCE: TileSize[] = ['large', 'medium', 'small', 'tall', 'medium', 'small', 'small', 'wide'];

export function assignTileSizes(tiles: TileDefinition[]): TileWithSize[] {
  return tiles.map((tile, i) => ({
    ...tile,
    size: SIZE_SEQUENCE[i % SIZE_SEQUENCE.length],
  }));
}

export function fisherYatesShuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
