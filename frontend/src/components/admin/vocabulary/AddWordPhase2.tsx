'use client';

import { useRef, useState } from 'react';
import { PartOfSpeech, POS_LABELS, VocabularyWord } from '@/lib/vocabulary/vocabulary.types';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { AdminInput } from '@/components/admin/common/AdminInput';
import { PosBadge } from './PosBadge';

interface Props {
  wordEn: string;
  wordCs: string;
  initial?: Partial<VocabularyWord>;
  submitLabel?: string;
  onSubmit: (data: {
    pos: PartOfSpeech;
    exampleSentence: string | null;
    note: string | null;
    pronunciationFile?: File;
    imageFile?: File;
    pronunciationUrl?: string | null;
    imageUrl?: string | null;
  }) => void;
  onBack?: () => void;
  onClose: () => void;
  loading?: boolean;
  showWarning?: boolean;
}

const POS_LIST = Object.keys(POS_LABELS) as PartOfSpeech[];

export function AddWordPhase2({ wordEn, wordCs, initial, submitLabel = 'Uložit', onSubmit, onBack, onClose, loading, showWarning }: Props) {
  const [pos, setPos] = useState<PartOfSpeech | null>(initial?.pos ?? null);
  const [example, setExample] = useState(initial?.exampleSentence ?? '');
  const [note, setNote] = useState(initial?.note ?? '');
  const [pronunciationFile, setPronunciationFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [posError, setPosError] = useState('');
  const audioRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!pos) { setPosError('Vyberte slovní druh'); return; }
    onSubmit({
      pos,
      exampleSentence: example.trim() || null,
      note: note.trim() || null,
      pronunciationFile: pronunciationFile ?? undefined,
      imageFile: imageFile ?? undefined,
      pronunciationUrl: initial?.pronunciationUrl,
      imageUrl: initial?.imageUrl,
    });
  };

  return (
    <div className="flex flex-col gap-admin-lg">
      {showWarning && (
        <div className="flex items-start gap-2 bg-admin-surface-2 border border-admin-border rounded-admin-md p-admin-sm text-admin-xs text-admin-text-muted">
          <i className="ti ti-info-circle text-admin-primary mt-0.5 shrink-0" aria-hidden="true" />
          Toto slovíčko je sdílené. Změny se projeví ve všech lekcích kde je použito.
        </div>
      )}

      <div className="flex items-center gap-2 text-admin-sm font-medium text-admin-text py-2 border-b border-admin-border">
        <span>{wordEn}</span>
        <span className="text-admin-text-muted">→</span>
        <span>{wordCs}</span>
      </div>

      <div>
        <p className="text-admin-xs text-admin-text-muted mb-2">Slovní druh *</p>
        <div className="flex flex-wrap gap-1.5">
          {POS_LIST.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { setPos(p); setPosError(''); }}
              className={`px-2 py-1 rounded border text-admin-xs transition-colors ${pos === p ? 'border-admin-primary bg-admin-primary text-white' : 'border-admin-border text-admin-text-muted hover:text-admin-text hover:border-admin-primary'}`}
            >
              {POS_LABELS[p]}
            </button>
          ))}
        </div>
        {posError && <p className="text-admin-xs text-admin-danger mt-1">{posError}</p>}
      </div>

      <AdminInput
        label="Příklad věty"
        value={example}
        onChange={(e) => setExample(e.target.value)}
        placeholder="The animal ran through the forest."
      />

      <div>
        <p className="text-admin-xs text-admin-text-muted mb-1">Výslovnost (audio)</p>
        <button
          type="button"
          onClick={() => audioRef.current?.click()}
          className="flex items-center gap-2 px-admin-md py-1.5 text-admin-xs text-admin-text-muted border border-dashed border-admin-border rounded-admin-sm hover:border-admin-primary hover:text-admin-primary transition-colors"
        >
          <i className="ti ti-upload text-[13px]" aria-hidden="true" />
          {pronunciationFile ? pronunciationFile.name : 'Nahrát soubor'}
        </button>
        <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={(e) => setPronunciationFile(e.target.files?.[0] ?? null)} />
      </div>

      <div>
        <p className="text-admin-xs text-admin-text-muted mb-1">Obrázek</p>
        <button
          type="button"
          onClick={() => imgRef.current?.click()}
          className="flex items-center gap-2 px-admin-md py-1.5 text-admin-xs text-admin-text-muted border border-dashed border-admin-border rounded-admin-sm hover:border-admin-primary hover:text-admin-primary transition-colors"
        >
          <i className="ti ti-photo text-[13px]" aria-hidden="true" />
          {imageFile ? imageFile.name : 'Nahrát obrázek'}
        </button>
        <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
      </div>

      <AdminInput
        label="Poznámka"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nepravidelné množné číslo: animals"
      />

      <div className="flex items-center justify-between gap-admin-sm pt-admin-sm border-t border-admin-border">
        <div className="flex gap-admin-sm">
          {onBack && <AdminButton variant="ghost" icon="ti-arrow-left" onClick={onBack}>Zpět</AdminButton>}
          <AdminButton variant="ghost" onClick={onClose}>Zrušit</AdminButton>
        </div>
        <AdminButton variant="primary" loading={loading} onClick={handleSubmit}>{submitLabel}</AdminButton>
      </div>
    </div>
  );
}
