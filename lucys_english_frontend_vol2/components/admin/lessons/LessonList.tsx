'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lesson, Course } from '@/lib/types/lesson.types';
import { LessonsApi } from '@/lib/api/lessons.api';
import { CoursesApi } from '@/lib/api/courses.api';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { CreateLessonModal } from './CreateLessonModal';
import { LessonEditor } from './LessonEditor';
import { Button } from '../../ui/Button';

export const LessonList: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const loadLessons = useCallback(async () => {
    const data = await LessonsApi.findAll({
      search: search || undefined,
      type: 'VOCABULARY',
      courseId: selectedCourseId,
    });
    setLessons(data);
  }, [search, selectedCourseId]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  useEffect(() => {
    CoursesApi.findAll().then(setCourses);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await LessonsApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      loadLessons();
    } finally {
      setDeleting(false);
    }
  };

  const sorted = [...lessons].sort((a, b) =>
    sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  );

  if (editingLesson) {
    return (
      <LessonEditor
        lesson={editingLesson}
        onSaved={() => { setEditingLesson(null); loadLessons(); }}
        onCancel={() => setEditingLesson(null)}
      />
    );
  }

  return (
    <>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Správa lekcí</h2>
          <Button variant="pink" onClick={() => setCreateOpen(true)}>
            + Vytvořit lekci
          </Button>
        </div>

        <div className="admin-filters">
          <input
            className="input-field"
            placeholder="Vyhledat podle názvu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />

          <select
            className="input-field"
            style={{ width: 'auto' }}
            value={selectedCourseId || ''}
            onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Všechny kurzy</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <button
            className="btn btn-outline"
            onClick={() => setSortAsc((v) => !v)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>

        <div className="admin-list">
          {sorted.length === 0 && (
            <p className="admin-empty">Žádné lekce nenalezeny.</p>
          )}
          {sorted.map((lesson) => (
            <div key={lesson.id} className="admin-list-item">
              <div className="admin-list-item-info">
                <span className="admin-list-item-title">{lesson.title}</span>
                <span className="admin-list-item-meta">
                  {lesson.lessonVocabulary?.length ?? 0} slovíček
                </span>
              </div>
              <div className="admin-list-item-actions">
                <button
                  className="vocab-btn vocab-btn-edit"
                  onClick={() => setEditingLesson(lesson)}
                >
                  upravit
                </button>
                <button
                  className="vocab-btn vocab-btn-remove"
                  onClick={() => setDeleteTarget(lesson)}
                >
                  smazat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateLessonModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(lesson) => { loadLessons(); setEditingLesson(lesson); }}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Smazat lekci?"
        description={`Opravdu chcete smazat lekci "${deleteTarget?.title}"? Tato akce je nevratná.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
};
