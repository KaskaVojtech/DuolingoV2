'use client';

/**
 * Image crop modal (pan and zoom) in Discord/Instagram style; crops the result via canvas to the course tile aspect ratio.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface Props {

  src: string;

  aspect?: number;

  outputWidth?: number;
  fileName?: string;
  onCancel: () => void;
  onCrop: (file: File, dataUrl: string) => void;
}

const VIEWPORT_W = 340;

export function ImageCropModal({
  src, aspect = 220 / 143, outputWidth = 660, fileName = 'thumbnail.jpg', onCancel, onCrop,
}: Props) {
  const viewportH = Math.round(VIEWPORT_W / aspect);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const coverScale = natural ? Math.max(VIEWPORT_W / natural.w, viewportH / natural.h) : 1;
  const scale = coverScale * zoom;
  const imgW = natural ? natural.w * scale : 0;
  const imgH = natural ? natural.h * scale : 0;

  const clampOffset = useCallback((o: { x: number; y: number }) => {
    return {
      x: Math.min(0, Math.max(VIEWPORT_W - imgW, o.x)),
      y: Math.min(0, Math.max(viewportH - imgH, o.y)),
    };
  }, [imgW, imgH, viewportH]);

  useEffect(() => {
    if (!natural) return;
    setOffset((prev) => {

      const centered = { x: (VIEWPORT_W - imgW) / 2, y: (viewportH - imgH) / 2 };
      const base = prev.x === 0 && prev.y === 0 ? centered : prev;
      return clampOffset(base);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [natural, zoom]);

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setOffset(clampOffset({ x: drag.current.ox + dx, y: drag.current.oy + dy }));
  };
  const onPointerUp = () => { drag.current = null; };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(3, Math.max(1, z - e.deltaY * 0.0015)));
  };

  const handleConfirm = () => {
    if (!natural || !imgRef.current) return;

    const srcX = -offset.x / scale;
    const srcY = -offset.y / scale;
    const srcW = VIEWPORT_W / scale;
    const srcH = viewportH / scale;

    const outW = outputWidth;
    const outH = Math.round(outputWidth / aspect);
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgRef.current, srcX, srcY, srcW, srcH, 0, 0, outW, outH);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      onCrop(file, canvas.toDataURL('image/jpeg', 0.92));
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 admin-fade-in" style={{ background: 'rgba(7,8,22,0.7)', backdropFilter: 'blur(4px)' }} onClick={onCancel}>
      <div className="admin-card admin-scale-in w-full max-w-md p-admin-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-admin-base font-bold text-admin-text mb-1">Oříznout obrázek</h2>
        <p className="text-admin-xs text-admin-text-muted mb-admin-md">Posuňte a přibližte výřez tak, jak se má zobrazit na dlaždici kurzu.</p>

        <div
          className="relative mx-auto overflow-hidden rounded-admin-md border border-admin-border bg-admin-bg select-none touch-none cursor-grab active:cursor-grabbing"
          style={{ width: VIEWPORT_W, height: viewportH }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt="Ořez"
            onLoad={onImgLoad}
            draggable={false}
            className="absolute max-w-none pointer-events-none"
            style={{ width: imgW || 'auto', height: imgH || 'auto', left: offset.x, top: offset.y, visibility: natural ? 'visible' : 'hidden' }}
          />

          <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)' }}>
            <div className="absolute inset-y-0 left-1/3 w-px bg-white/20" />
            <div className="absolute inset-y-0 left-2/3 w-px bg-white/20" />
            <div className="absolute inset-x-0 top-1/3 h-px bg-white/20" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-white/20" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-admin-md">
          <i className="ti ti-photo text-admin-text-muted text-[14px]" />
          <input
            type="range" min={1} max={3} step={0.01} value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 accent-admin-primary"
          />
          <i className="ti ti-photo text-admin-text-muted text-[20px]" />
        </div>

        <div className="flex gap-2 mt-admin-lg">
          <button type="button" onClick={onCancel} className="admin-btn admin-btn--ghost admin-btn--md flex-1">Zrušit</button>
          <button type="button" onClick={handleConfirm} disabled={!natural} className="admin-btn admin-btn--primary admin-btn--md flex-1">
            <i className="ti ti-crop" /> Použít výřez
          </button>
        </div>
      </div>
    </div>
  );
}
