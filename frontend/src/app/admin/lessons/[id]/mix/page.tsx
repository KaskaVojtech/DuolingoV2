'use client';

import { use, useEffect } from 'react';
import { useRequireAdmin } from '@/lib/auth/auth.hooks';
import { fetchGenerationWords, fetchLessonMix } from '@/lib/mix-editor/mix-editor.api';
import { useMixEditorStore } from '@/lib/mix-editor/mix-editor.store';
import { MixEditor } from '@/components/admin/mix-editor/MixEditor';
import { fetchLessonVocabulary } from '@/lib/vocabulary/vocabulary.api';
import { fetchLessonInfo } from '@/lib/lesson-content/lesson-content.api';

export default function MixEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading } = useRequireAdmin();
  const { initMix, setGenerationWords } = useMixEditorStore();

  useEffect(() => {
    Promise.all([
      fetchLessonMix(id),
      fetchLessonVocabulary(id, { searchQuery: '', pos: null, importedOnly: false, sortField: 'wordEn', sortDirection: 'asc' }),
      fetchLessonInfo(id),
    ]).then(([mix, entries, info]) => {
      const words = entries.map((entry) => entry.word);
      initMix(mix, words, info.lessonTitle, info.courseId, info.courseTitle);
    });

    fetchGenerationWords(id)
      .then((words) => setGenerationWords(words))
      .catch(() => {

      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) return null;

  return <MixEditor />;
}
