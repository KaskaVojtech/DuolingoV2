'use client';

import { use, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { createExercise } from '@/lib/exercise/exercise.api';
import { useExerciseStore } from '@/lib/exercise/exercise.store';

export default function NewExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: lessonId } = use(params);
  const { isLoading } = useRequireAdmin();
  const router = useRouter();
  const { setExercise } = useExerciseStore();
  const hasCreated = useRef(false);

  useEffect(() => {
    if (hasCreated.current) return;
    hasCreated.current = true;
    createExercise(lessonId).then((ex) => {
      setExercise(ex);
      router.replace(`/admin/blocks/${ex.id}/edit-exercise`);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  if (isLoading) return null;

  return null;
}
