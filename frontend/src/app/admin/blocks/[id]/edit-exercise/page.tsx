'use client';

import { use, useEffect } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { fetchExercise } from '@/lib/exercise/exercise.api';
import { useExerciseStore } from '@/lib/exercise/exercise.store';
import { ExerciseEditor } from '@/components/admin/exercise-editor/ExerciseEditor';

export default function EditExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading } = useRequireAdmin();
  const { setExercise, exercise } = useExerciseStore();

  useEffect(() => {
    fetchExercise(id).then((ex) => setExercise(ex));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) return null;

  return <ExerciseEditor lessonId={exercise.lessonId} />;
}
