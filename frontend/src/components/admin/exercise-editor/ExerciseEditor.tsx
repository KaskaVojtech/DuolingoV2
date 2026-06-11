'use client';

import { useEffect, useRef, useState } from 'react';
import { useExerciseStore } from '@/lib/exercise/exercise.store';
import { fetchLessonInfo } from '@/lib/lesson-content/lesson-content.api';
import { ExerciseMetaBar } from './ExerciseMetaBar';
import { ExerciseItemsList } from './ExerciseItemsList';
import { ExercisePreview } from './preview/ExercisePreview';

interface Props {
  lessonId: string;
}

export function ExerciseEditor({ lessonId }: Props) {
  const { previewMode, exercise, setInstructions } = useExerciseStore();
  const [meta, setMeta] = useState({ courseTitle: '', lessonTitle: '', courseId: '' });
  const [instrVal, setInstrVal] = useState(exercise.instructions ?? '');
  const instrDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setInstrVal(exercise.instructions ?? ''); }, [exercise.id]);

  useEffect(() => {
    if (lessonId) {
      fetchLessonInfo(lessonId).then((info) =>
        setMeta({ courseTitle: info.courseTitle, lessonTitle: info.lessonTitle, courseId: info.courseId })
      );
    }
  }, [lessonId]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (useExerciseStore.getState().isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const handleInstrChange = (v: string) => {
    setInstrVal(v);
    if (instrDebounce.current) clearTimeout(instrDebounce.current);
    instrDebounce.current = setTimeout(() => setInstructions(v), 800);
  };

  return (
    <div className="flex flex-col min-h-full">
      <ExerciseMetaBar
        courseTitle={meta.courseTitle}
        lessonTitle={meta.lessonTitle}
        courseId={meta.courseId}
        lessonId={lessonId}
      />
      <div className="flex-1 p-admin-2xl max-w-3xl">
        {!previewMode && (
          <div className="mb-admin-lg">
            <label className="block text-admin-xs text-admin-text-muted mb-1">Instrukce (volitelné)</label>
            <textarea
              className="w-full bg-admin-surface-2 border border-admin-border rounded-admin-sm px-admin-md py-2 text-admin-sm text-admin-text resize-none focus:outline-none focus:border-admin-primary"
              rows={2}
              value={instrVal}
              onChange={(e) => handleInstrChange(e.target.value)}
              placeholder="Pokyny pro žáka k tomuto cvičení..."
            />
          </div>
        )}
        {previewMode ? <ExercisePreview /> : <ExerciseItemsList />}
      </div>
    </div>
  );
}
