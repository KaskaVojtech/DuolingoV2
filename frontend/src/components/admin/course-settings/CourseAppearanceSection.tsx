'use client';

import { useState, useRef } from 'react';
import { useCourseSettingsStore } from '@/lib/course-settings/course-settings.store';
import { updateCourseTitle, updateCourseThumbnail } from '@/lib/course-settings/course-settings.api';
import { uploadCourseThumbnail } from '@/lib/course-create/course-create.api';
import { useUIStore } from '@/lib/stores/ui.store';
import { ImageCropModal } from '@/components/admin/shared/ImageCropModal';

const PRESET_COLORS = [
  '#2d4a7a', '#4a2d6a', '#1a6fd4', '#0f6e56',
  '#7a2d2d', '#7a6a2d', '#2d7a4a', '#4a4a7a',
  '#7a3d2d', '#2d5a7a', '#6a2d5a', '#3d7a2d',
  '#5b7cfa', '#f0566b', '#22c55e', '#f59e0b',
];

interface Props { courseId: string }

export function CourseAppearanceSection({ courseId }: Props) {
  const { courseTitle, thumbnailColor, thumbnailUrl, setCourseTitle, setThumbnailColor, setThumbnailUrl } = useCourseSettingsStore();
  const showToast = useUIStore((s) => s.showToast);

  const [titleValue, setTitleValue] = useState(courseTitle);
  const [hexInput, setHexInput] = useState(thumbnailColor.replace('#', ''));
  const [thumbnailType, setThumbnailType] = useState<'color' | 'image'>(thumbnailUrl ? 'image' : 'color');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isDirty =
    titleValue !== courseTitle ||
    (thumbnailType === 'color' && `#${hexInput}` !== thumbnailColor && hexInput.length === 6) ||
    pendingFile !== null;

  const handleColorPreset = (color: string) => {
    setThumbnailColor(color);
    setHexInput(color.replace('#', ''));
  };

  const handleHexInput = (raw: string) => {
    const clean = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setHexInput(clean);
    if (clean.length === 6) setThumbnailColor(`#${clean}`);
  };

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { showToast('Soubor je příliš velký (max 5 MB)', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => setCropSrc(e.target?.result as string);
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleCropped = (file: File, dataUrl: string) => {
    setPreviewDataUrl(dataUrl);
    setPendingFile(file);
    setCropSrc(null);
  };

  const handleSave = async () => {
    if (!titleValue.trim()) { showToast('Název nesmí být prázdný', 'error'); return; }
    setSaving(true);
    try {
      const tasks: Promise<void>[] = [];

      if (titleValue.trim() !== courseTitle) {
        tasks.push(updateCourseTitle(courseId, titleValue.trim()).then(() => setCourseTitle(titleValue.trim())));
      }

      let finalUrl = thumbnailUrl;
      if (thumbnailType === 'image' && pendingFile) {
        const { url } = await uploadCourseThumbnail(pendingFile);
        finalUrl = url;
        setThumbnailUrl(url);
        setPendingFile(null);
        setPreviewDataUrl(null);
      } else if (thumbnailType === 'color') {
        finalUrl = null;
      }

      const newColor = thumbnailType === 'color' ? (hexInput.length === 6 ? `#${hexInput}` : thumbnailColor) : thumbnailColor;
      tasks.push(updateCourseThumbnail(courseId, newColor, finalUrl));
      if (thumbnailType === 'color') setThumbnailColor(newColor);

      await Promise.all(tasks);
      showToast('Kurz uložen', 'success');
    } catch {
      showToast('Chyba při ukládání', 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentColor = hexInput.length === 6 ? `#${hexInput}` : thumbnailColor;
  const imagePreview = previewDataUrl ?? thumbnailUrl;

  return (
    <div className="flex flex-col gap-6">

      <div>
        <label className="block text-admin-xs font-medium text-admin-text-muted uppercase tracking-wider mb-2">Název kurzu</label>
        <input
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          maxLength={120}
          placeholder="Název kurzu"
          className="w-full bg-admin-surface-2 border border-admin-border rounded-admin-sm px-3 py-2.5 text-admin-sm text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:border-admin-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-admin-xs font-medium text-admin-text-muted uppercase tracking-wider mb-2">Náhledový obrázek</label>

        <div className="flex border border-admin-border rounded-admin-sm overflow-hidden w-fit mb-4">
          {(['color', 'image'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setThumbnailType(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-admin-xs font-medium transition-colors ${thumbnailType === mode ? 'bg-admin-primary text-white' : 'text-admin-text-muted hover:text-admin-text'}`}
            >
              <i className={`ti ${mode === 'color' ? 'ti-palette' : 'ti-photo'} text-[13px]`} />
              {mode === 'color' ? 'Barva' : 'Obrázek'}
            </button>
          ))}
        </div>

        {thumbnailType === 'color' && (
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-admin-md border border-admin-border shrink-0" style={{ background: currentColor }} />
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-8 gap-1.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorPreset(color)}
                    className="w-6 h-6 rounded transition-transform hover:scale-110"
                    style={{ background: color, outline: thumbnailColor === color ? `2px solid white` : 'none', outlineOffset: '2px' }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-admin-sm text-admin-text-muted font-mono">#</span>
                <input
                  className="bg-admin-surface-2 border border-admin-border rounded-admin-sm px-2 py-1 text-admin-sm text-admin-text w-24 font-mono uppercase focus:outline-none focus:border-admin-primary"
                  value={hexInput}
                  onChange={(e) => handleHexInput(e.target.value)}
                  maxLength={6}
                  placeholder="4f6ef7"
                />
              </div>
            </div>
          </div>
        )}

        {thumbnailType === 'image' && (
          imagePreview ? (
            <div className="relative w-32 h-20 rounded-admin-md overflow-hidden border border-admin-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Náhled" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setPreviewDataUrl(null); setPendingFile(null); setThumbnailUrl(null); }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <i className="ti ti-x text-[11px]" />
              </button>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-admin-md p-6 cursor-pointer transition-colors ${dragOver ? 'border-admin-primary bg-admin-primary/5' : 'border-admin-border hover:border-admin-primary/50'}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            >
              <i className="ti ti-cloud-upload text-[28px] text-admin-text-muted" />
              <p className="text-admin-sm text-admin-text-muted">Přetáhněte nebo klikněte pro výběr</p>
              <p className="text-admin-xs text-admin-text-muted">PNG, JPG, WEBP — max 5 MB</p>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          )
        )}
      </div>

      <div className="pt-2 border-t border-admin-border">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-admin-primary text-white rounded-admin-sm text-admin-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? <i className="ti ti-loader-2 text-[14px] animate-spin" /> : <i className="ti ti-device-floppy text-[14px]" />}
          {saving ? 'Ukládání…' : 'Uložit změny'}
        </button>
      </div>

      {cropSrc && (
        <ImageCropModal src={cropSrc} onCancel={() => setCropSrc(null)} onCrop={handleCropped} />
      )}
    </div>
  );
}
