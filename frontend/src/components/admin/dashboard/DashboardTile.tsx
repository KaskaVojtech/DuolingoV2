'use client';

import { useRouter } from 'next/navigation';
import { TileDefinition } from '@/lib/dashboard/tiles.config';

interface Props {
  tile: TileDefinition;
  area: string;
}

export function DashboardTile({ tile, area }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(tile.href)}
      style={{
        gridArea: area,
        background: tile.bg,
        borderRadius: 0,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'left',
        width: '100%',
        border: 'none',
      }}
      className="group dashboard-tile"
    >

      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          background: tile.accent,
          width: tile.decoSize,
          aspectRatio: '1 / 1',
          left: tile.decoX,
          top: tile.decoY,
          transform: `rotate(${tile.decoAngle}deg)`,
          opacity: 0.55,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
        }}
        className="group-hover:opacity-75"
      />

      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          background: tile.accent,
          width: `calc(${tile.decoSize} * 0.5)`,
          aspectRatio: '1 / 1',
          right: tile.decoX,
          bottom: tile.decoY,
          transform: `rotate(${tile.decoAngle + 22}deg)`,
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />

      <i
        className={`ti ${tile.icon} relative z-10`}
        style={{
          fontSize: '1.6rem',
          color: 'rgba(255,255,255,0.9)',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          display: 'block',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <p
          style={{
            fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.02em',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            textTransform: 'uppercase',
            marginBottom: '0.2rem',
          }}
        >
          {tile.label}
        </p>
        <p
          style={{
            fontSize: 'clamp(0.65rem, 0.85vw, 0.75rem)',
            color: 'rgba(255,255,255,0.6)',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {tile.description}
        </p>
      </div>
    </button>
  );
}
