'use client';

import { useState } from 'react';
import { checkVocabularyDuplicate } from '@/lib/vocabulary/vocabulary.api';
import { AdminButton } from '@/components/admin/common/AdminButton';
import { AdminInput } from '@/components/admin/common/AdminInput';

interface Phase1Data { wordEn: string; wordCs: string }

interface Props {
  onNext: (data: Phase1Data) => void;
  onClose: () => void;
}

export function AddWordPhase1({ onNext, onClose }: Props) {
  const [wordEn, setWordEn] = useState('');
  const [wordCs, setWordCs] = useState('');
  const [checking, setChecking] = useState(false);
  const [dupWarning, setDupWarning] = useState(false);
  const [errors, setErrors] = useState<{ wordEn?: string; wordCs?: string }>({});

  const canContinue = wordEn.trim().length > 0 && wordCs.trim().length > 0;

  const validate = () => {
    const e: typeof errors = {};
    if (!wordEn.trim()) e.wordEn = 'Anglické slovo je povinné';
    else if (wordEn.length > 200) e.wordEn = 'Max. 200 znaků';
    if (!wordCs.trim()) e.wordCs = 'Český překlad je povinný';
    else if (wordCs.length > 200) e.wordCs = 'Max. 200 znaků';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setChecking(true);
    const { exists } = await checkVocabularyDuplicate(wordEn.trim(), wordCs.trim());
    setChecking(false);
    if (exists && !dupWarning) { setDupWarning(true); return; }
    onNext({ wordEn: wordEn.trim(), wordCs: wordCs.trim() });
  };

  return (
    <div className="flex flex-col gap-admin-lg">
      <AdminInput
        label="Anglicky *"
        value={wordEn}
        onChange={(e) => setWordEn(e.target.value)}
        error={errors.wordEn}
        placeholder="animal"
        autoFocus
      />
      <AdminInput
        label="Česky *"
        value={wordCs}
        onChange={(e) => setWordCs(e.target.value)}
        error={errors.wordCs}
        placeholder="zvíře"
      />

      {dupWarning && (
        <div className="bg-admin-surface-2 border border-admin-border rounded-admin-md p-admin-md text-admin-sm">
          <p className="text-admin-text mb-admin-sm">
            ⚠ Toto slovíčko již existuje v databázi. Přesto ho chcete přidat do lekce?
          </p>
          <div className="flex gap-admin-sm">
            <AdminButton variant="ghost" onClick={() => setDupWarning(false)}>Zpět</AdminButton>
            <AdminButton variant="primary" onClick={() => onNext({ wordEn: wordEn.trim(), wordCs: wordCs.trim() })}>
              Přidat stejně
            </AdminButton>
          </div>
        </div>
      )}

      {!dupWarning && (
        <div className="flex justify-end gap-admin-sm">
          <AdminButton variant="ghost" onClick={onClose}>Zrušit</AdminButton>
          <AdminButton variant="primary" loading={checking} onClick={handleNext} disabled={!canContinue}>
            Dále →
          </AdminButton>
        </div>
      )}
    </div>
  );
}
