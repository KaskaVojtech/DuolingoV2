'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lesson, Vocabulary } from '@/lib/types/lesson.types';
import { LessonsApi } from '@/lib/api/lessons.api';
import { LessonVocabularyColumn } from './LessonVocabularyColumn';
import { ExistingVocabularyColumn } from './ExistingVocabularyColumn';
import { VocabularyFormColumn } from './VocabularyFormColumn';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface LessonEditorProps {
  lesson: Lesson;
  onSaved: () => void;
  onCancel: () => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onSaved, onCancel }) => {
  const [title, setTitle] = useState(lesson.title);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [editingVocab, setEditingVocab] = useState<(Vocabulary & { _editMode?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadVocabulary = useCallback(async () => {
    const data = await LessonsApi.getVocabulary(lesson.id);
    setVocabulary(data.map((lv) => lv.vocabulary));
  }, [lesson.id]);

  useEffect(() => {
    loadVocabulary();
  }, [loadVocabulary]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Název je povinný');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await LessonsApi.update(lesson.id, { title: title.trim() });
      onSaved();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const vocabIds = vocabulary.map((v) => v.id);

  return (
    <div className="lesson-editor">
      <div className="lesson-editor-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <Input
              label="Název lekce"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', paddingBottom: '2px' }}>
            <Button variant="pink" loading={saving} onClick={handleSave}>
              Uložit lekci
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Zpět
            </Button>
          </div>
        </div>
        {error && <div className="alert alert-error" style={{ marginTop: '0.5rem' }}>{error}</div>}
      </div>

      <div className="lesson-editor-columns">
        <LessonVocabularyColumn
          lessonId={lesson.id}
          vocabulary={vocabulary}
          onVocabularyChange={loadVocabulary}
          onEditVocabulary={setEditingVocab}
        />

        <ExistingVocabularyColumn
          lessonId={lesson.id}
          lessonVocabularyIds={vocabIds}
          onVocabularyAdded={loadVocabulary}
        />

        <VocabularyFormColumn
          lessonId={lesson.id}
          editingVocab={editingVocab}
          onSaved={loadVocabulary}
          onClear={() => setEditingVocab(null)}
        />
      </div>
    </div>
  );
};
