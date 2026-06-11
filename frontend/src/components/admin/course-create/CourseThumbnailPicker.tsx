'use client';

import { useRef, useState } from 'react';
import { ThumbnailType } from '@/lib/course-create/course-create.types';
import { CourseColorPicker } from './CourseColorPicker';
import { ImageCropModal } from '@/components/admin/shared/ImageCropModal';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface Props {
  thumbnailType: ThumbnailType;
  thumbnailUrl: string | null;
  thumbnailColor: string;
  previewDataUrl: string | null;
  onTypeChange: (type: ThumbnailType) => void;
  onFileSelect: (file: File, dataUrl: string) => void;
  onImageRemove: () => void;
  onColorChange: (color: string) => void;
  error?: string;
}

export function CourseThumbnailPicker({
  thumbnailType, thumbnailUrl, thumbnailColor, previewDataUrl,
  onTypeChange, onFileSelect, onImageRemove, onColorChange, error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setFileError('');
    if (file.size > MAX_FILE_SIZE) {
      setFileError('Soubor je příliš velký (max. 5 MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setCropSrc(e.target?.result as string);
    reader.readAsDataURL(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCropped = (file: File, dataUrl: string) => {
    onFileSelect(file, dataUrl);
    setCropSrc(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>

      <div className="flex border border-admin-border rounded-admin-sm overflow-hidden w-fit mb-admin-md">
        {(['image', 'color'] as ThumbnailType[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onTypeChange(mode)}
            className={`flex items-center gap-1.5 px-admin-md py-1.5 text-admin-xs font-medium transition-colors ${thumbnailType === mode ? 'bg-admin-primary text-white' : 'bg-transparent text-admin-text-muted hover:text-admin-text'}`}
          >
            <i className={`ti ${mode === 'image' ? 'ti-photo' : 'ti-palette'} text-[13px]`} aria-hidden="true" />
            {mode === 'image' ? 'Obrázek' : 'Barva'}
          </button>
        ))}
      </div>

      {thumbnailType === 'image' && (
        <>
          {previewDataUrl || thumbnailUrl ? (
            <div className="thumbnail-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewDataUrl ?? thumbnailUrl ?? ''} alt="Náhled" className="w-full h-full object-cover rounded-admin-md" />
              <button type="button" onClick={onImageRemove} className="thumbnail-preview__remove" aria-label="Odebrat obrázek">
                <i className="ti ti-x text-[14px]" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div
              className={`thumbnail-upload-zone ${dragOver ? 'thumbnail-upload-zone--drag-over' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            >
              <i className="ti ti-cloud-upload text-[32px] text-admin-text-muted" aria-hidden="true" />
              <p className="text-admin-sm text-admin-text-muted">Nahrajte obrázek nebo přetáhněte</p>
              <p className="text-admin-xs text-admin-text-muted">PNG, JPG, WEBP — max. 5 MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          )}
          {fileError && <p className="text-admin-xs text-admin-danger mt-1">{fileError}</p>}
          {error && <p className="text-admin-xs text-admin-danger mt-1">{error}</p>}
        </>
      )}

      {thumbnailType === 'color' && (
        <CourseColorPicker value={thumbnailColor} onChange={onColorChange} />
      )}

      {cropSrc && (
        <ImageCropModal src={cropSrc} onCancel={() => setCropSrc(null)} onCrop={handleCropped} />
      )}
    </div>
  );
}
