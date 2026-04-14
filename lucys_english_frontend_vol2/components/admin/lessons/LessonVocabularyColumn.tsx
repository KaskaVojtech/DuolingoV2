'use client';

import React, { useState } from 'react';
import { Vocabulary } from '@/lib/types/lesson.types';
import { LessonsApi } from '@/lib/api/lessons.api';
import { EditVocabularyModal } from './EditVocabularyModal';

interface LessonVocabularyColumnProps {
  lessonId: number;
  vocabulary: Vocabulary[];
  onVocabularyChange: () => void;
  onEditVocabulary: (vocab: Vocabulary) => void;
}

export const LessonVocabularyColumn: React.FC<LessonVocabularyColumnProps> = ({
  lessonId,
  vocabulary,
  onVocabularyChange,
  onEditVocabulary,
}) => {
  const [editModal, setEditModal] = useState<Vocabulary | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  const handleRemove = async (vocabId: number) => {
    setRemoving(vocabId);
    try {
      await LessonsApi.removeVocabulary(lessonId, vocabId);
      onVocabularyChange();
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(null);
    }
  };

  const handleEditClick = (vocab: Vocabulary) => {
    setEditModal(vocab);
  };

  const handleEditGlobal = () => {
    if (editModal) {
      onEditVocabulary({ ...editModal, _editMode: 'global' } as Vocabulary & { _editMode: string });
      setEditModal(null);
    }
  };

  const handleEditLocal = async () => {
    if (editModal) {
      onEditVocabulary({ ...editModal, _editMode: 'local' } as Vocabulary & { _editMode: string });
      setEditModal(null);
    }
  };

  return (
    <>
      <div className="admin-column">
        <div className="admin-column-header">
          <h3 className="admin-column-title">Slovíčka v lekci</h3>
          <span className="admin-column-count">{vocabulary.length}</span>
        </div>

        <div className="admin-column-list">
          {vocabulary.length === 0 && (
            <p className="admin-empty">Žádná slovíčka. Přidejte ze středního sloupce.</p>
          )}
          {vocabulary.map((vocab) => (
            <div key={vocab.id} className="vocab-item">
              <div className="vocab-item-text">
                <span className="vocab-english">{vocab.english}</span>
                <span className="vocab-czech">{vocab.czech}</span>
              </div>
              <div className="vocab-item-actions">
                <button
                  className="vocab-btn vocab-btn-edit"
                  onClick={() => handleEditClick(vocab)}
                >
                  upravit
                </button>
                <button
                  className="vocab-btn vocab-btn-remove"
                  onClick={() => handleRemove(vocab.id)}
                  disabled={removing === vocab.id}
                >
                  {removing === vocab.id ? '...' : 'odebrat'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditVocabularyModal
        isOpen={!!editModal}
        vocabulary={editModal}
        onEditGlobal={handleEditGlobal}
        onEditLocal={handleEditLocal}
        onCancel={() => setEditModal(null)}
      />
    </>
  );
};
