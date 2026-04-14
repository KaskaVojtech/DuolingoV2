'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Vocabulary, Lesson } from '@/lib/types/lesson.types';
import { VocabularyApi } from '@/lib/api/vocabulary.api';
import { LessonsApi } from '@/lib/api/lessons.api';

interface ExistingVocabularyColumnProps {
  lessonId: number;
  lessonVocabularyIds: number[];
  onVocabularyAdded: () => void;
}

export const ExistingVocabularyColumn: React.FC<ExistingVocabularyColumnProps> = ({
  lessonId,
  lessonVocabularyIds,
  onVocabularyAdded,
}) => {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>([]);
  const [adding, setAdding] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadVocabulary = useCallback(async () => {
    setLoading(true);
    try {
      const query: { search?: string; lessonId?: number } = {};
      if (search) query.search = search;
      if (selectedLessonIds.length === 1) query.lessonId = selectedLessonIds[0];
      const data = await VocabularyApi.findAll(query);
      setVocabulary(data);
    } finally {
      setLoading(false);
    }
  }, [search, selectedLessonIds]);

  useEffect(() => {
    loadVocabulary();
  }, [loadVocabulary]);

  useEffect(() => {
    LessonsApi.findAll({ type: 'VOCABULARY' }).then(setLessons);
  }, []);

  const handleAdd = async (vocabId: number) => {
    setAdding(vocabId);
    try {
      await LessonsApi.addVocabulary(lessonId, vocabId);
      onVocabularyAdded();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(null);
    }
  };

  const toggleLesson = (id: number) => {
    setSelectedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const filtered = vocabulary.filter(
    (v) => selectedLessonIds.length === 0 ||
      v.lessonVocabulary?.some((lv) => selectedLessonIds.includes(lv.lesson?.id ?? 0))
  );

  return (
    <div className="admin-column">
      <div className="admin-column-header">
        <h3 className="admin-column-title">Existující slovíčka</h3>
      </div>

      <div className="admin-column-search">
        <input
          className="input-field"
          placeholder="Vyhledat slovo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        />

        {lessons.length > 0 && (
          <div className="lesson-filter">
            <p className="input-label" style={{ marginBottom: '0.4rem' }}>Filtrovat podle lekce:</p>
            <div className="lesson-filter-list">
              {lessons.filter((l) => l.id !== lessonId).map((lesson) => (
                <label key={lesson.id} className="lesson-filter-item">
                  <input
                    type="checkbox"
                    checked={selectedLessonIds.includes(lesson.id)}
                    onChange={() => toggleLesson(lesson.id)}
                  />
                  <span>{lesson.title}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="admin-column-list">
        {loading && <p className="admin-empty">Načítání...</p>}
        {!loading && filtered.length === 0 && (
          <p className="admin-empty">Žádná slovíčka nenalezena.</p>
        )}
        {filtered.map((vocab) => {
          const alreadyAdded = lessonVocabularyIds.includes(vocab.id);
          return (
            <div key={vocab.id} className={`vocab-item ${alreadyAdded ? 'vocab-item-added' : ''}`}>
              <div className="vocab-item-text">
                <span className="vocab-english">{vocab.english}</span>
                <span className="vocab-czech">{vocab.czech}</span>
              </div>
              <button
                className="vocab-btn vocab-btn-add"
                onClick={() => handleAdd(vocab.id)}
                disabled={alreadyAdded || adding === vocab.id}
              >
                {alreadyAdded ? '✓' : adding === vocab.id ? '...' : 'přidat'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
