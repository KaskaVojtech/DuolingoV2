'use client';

import React, { useState, useEffect } from 'react';
import { Vocabulary, CreateVocabularyDto } from '@/lib/types/lesson.types';
import { LessonsApi } from '@/lib/api/lessons.api';
import { VocabularyApi } from '@/lib/api/vocabulary.api';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface VocabularyFormColumnProps {
  lessonId: number;
  editingVocab: (Vocabulary & { _editMode?: string }) | null;
  onSaved: () => void;
  onClear: () => void;
}

export const VocabularyFormColumn: React.FC<VocabularyFormColumnProps> = ({
  lessonId,
  editingVocab,
  onSaved,
  onClear,
}) => {
  const [czech, setCzech] = useState('');
  const [english, setEnglish] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingVocab) {
      setCzech(editingVocab.czech);
      setEnglish(editingVocab.english);
      setNote(editingVocab.note || '');
    } else {
      setCzech('');
      setEnglish('');
      setNote('');
    }
    setError('');
  }, [editingVocab]);

  const handleSave = async () => {
    if (!czech.trim() || !english.trim()) {
      setError('Česky a anglicky jsou povinné');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dto: CreateVocabularyDto = {
        czech: czech.trim(),
        english: english.trim(),
        note: note.trim() || undefined,
      };

      if (editingVocab) {
        if (editingVocab._editMode === 'global') {
          // upravi globalne
          await VocabularyApi.update(editingVocab.id, dto);
        } else {
          // local - vytvoří nové a vymění v lekci
          await LessonsApi.removeVocabulary(lessonId, editingVocab.id);
          await LessonsApi.createAndAddVocabulary(lessonId, dto);
        }
      } else {
        // nové slovíčko
        await LessonsApi.createAndAddVocabulary(lessonId, dto);
      }

      onSaved();
      onClear();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!editingVocab;

  return (
    <div className="admin-column">
      <div className="admin-column-header">
        <h3 className="admin-column-title">
          {isEditing ? 'Upravit slovíčko' : 'Vytvořit slovíčko'}
        </h3>
        {isEditing && (
          <button className="vocab-btn vocab-btn-remove" onClick={onClear}>
            zrušit
          </button>
        )}
      </div>

      {isEditing && editingVocab._editMode && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          {editingVocab._editMode === 'global'
            ? 'Změna se projeví všude'
            : 'Vytvoří se nové slovíčko jen pro tuto lekci'}
        </div>
      )}

      {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
        <Input
          label="Anglicky"
          placeholder="např. Hello"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
        />
        <Input
          label="Česky"
          placeholder="např. Ahoj"
          value={czech}
          onChange={(e) => setCzech(e.target.value)}
        />
        <Input
          label="Poznámka (volitelné)"
          placeholder="např. výslovnost, příklad..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button variant="pink" fullWidth loading={loading} onClick={handleSave}>
          {isEditing ? 'Uložit změny' : 'Vytvořit a přidat'}
        </Button>
      </div>
    </div>
  );
};
