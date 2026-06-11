import { BENTO_TILES } from '@/lib/dashboard/tiles.config';
import { DashboardTile } from './DashboardTile';

const AREA_MAP: Record<string, string> = {
  'courses':         'kurzy',
  'lessons':         'lekce',
  'users':           'uziv',
  'groups':          'skupiny',
  'access-codes':    'kody',
  'courses-deleted': 'smazane',
};

export function DashboardGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gridTemplateRows: '190px 190px 140px',
        gridTemplateAreas: `
          "kurzy lekce uziv"
          "kurzy lekce skupiny"
          "kody  kody  smazane"
        `,
        gap: '5px',
      }}
    >
      {BENTO_TILES.map((tile) => (
        <DashboardTile
          key={tile.id}
          tile={tile}
          area={AREA_MAP[tile.id]}
        />
      ))}
    </div>
  );
}
