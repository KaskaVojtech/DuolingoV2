'use client';

import React, { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { GameEditorProps } from '@/lib/mix-editor/mix-editor.types';
import { ListeningData, ListeningQuestion } from './listening.types';
import { MCOption } from '../multiple-choice/multiple-choice.types';
import { GameEditorLayout } from '../shared/GameEditorLayout';
import { GameItemList } from '../shared/GameItemList';
import { uploadMedia } from '@/lib/content-editor/content-editor.api';
import { useUIStore } from '@/lib/stores/ui.store';

function makeListeningQuestion(): ListeningQuestion {
  return {
    id: uuid(),
    audioUrl: '',
    question: 'What did you hear?',
    options: [
      { id: uuid(), text: '', isCorrect: true },
      { id: uuid(), text: '', isCorrect: false },
      { id: uuid(), text: '', isCorrect: false },
      { id: uuid(), text: '', isCorrect: false },
    ],
  };
}

function QuestionRow({
  question,
  onChange,
}: {
  question: ListeningQuestion;
  onChange: (q: ListeningQuestion) => void;
}) {
  function setCorrect(optId: string) {
    onChange({
      ...question,
      options: question.options.map((o) => ({ ...o, isCorrect: o.id === optId })),
    });
  }

  function updateOption(id: string, text: string) {
    onChange({
      ...question,
      options: question.options.map((o) => (o.id === id ? { ...o, text } : o)),
    });
  }

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const { url } = await uploadMedia(file, 'audio');
      onChange({ ...question, audioUrl: url });
    } catch {
      useUIStore.getState().showToast('Nahrání audia selhalo', 'error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="listening-question">
      <div className="listening-question__audio">
        <label className="listening-question__audio-label">
          <i className="ti ti-volume" />
          Audio URL:
        </label>
        <input
          className="admin-input"
          value={question.audioUrl}
          onChange={(e) => onChange({ ...question, audioUrl: e.target.value })}
          placeholder="URL audio souboru..."
        />
        <button
          type="button"
          className="listening-question__upload"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          <i className={`ti ${uploading ? 'ti-loader-2 listening-question__spin' : 'ti-upload'}`} />
          {uploading ? 'Nahrávám…' : 'Nahrát ze zařízení'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
        {question.audioUrl && (
          <button
            type="button"
            className="listening-question__play"
            onClick={() => new Audio(question.audioUrl).play()}
            aria-label="Přehrát"
          >
            <i className="ti ti-player-play" />
          </button>
        )}
      </div>
      <input
        className="admin-input"
        value={question.question}
        onChange={(e) => onChange({ ...question, question: e.target.value })}
        placeholder="Otázka..."
      />
      <div className="mc-question__options">
        {question.options.map((opt) => (
          <div key={opt.id} className="mc-option">
            <button
              type="button"
              className={`mc-option__toggle ${opt.isCorrect ? 'mc-option__toggle--correct' : ''}`}
              onClick={() => setCorrect(opt.id)}
              aria-label={opt.isCorrect ? 'Správná odpověď' : 'Označit jako správnou'}
            >
              <i className={`ti ${opt.isCorrect ? 'ti-circle-check' : 'ti-circle-x'}`} />
            </button>
            <input
              className="admin-input"
              value={opt.text}
              onChange={(e) => updateOption(opt.id, e.target.value)}
              placeholder="Možnost..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ListeningEditor({ data, onChange, lessonWords }: GameEditorProps<ListeningData>) {
  const hasAudio = lessonWords.some((w) => w.pronunciationUrl);

  return (
    <GameEditorLayout title="Poslech" subtitle="Poslechové otázky s výběrem odpovědi">
      {!hasAudio && (
        <div className="listening-editor__warning">
          <i className="ti ti-alert-triangle" />
          Tato hra vyžaduje audio soubory. Přejděte do slovíčka a nahrajte výslovnost, nebo nahrajte audio přímo zde.
        </div>
      )}
      <GameItemList
        items={data.questions}
        onAdd={() => onChange({ ...data, questions: [...data.questions, makeListeningQuestion()] })}
        onRemove={(id) => onChange({ ...data, questions: data.questions.filter((q) => q.id !== id) })}
        minItems={1}
        maxItems={8}
        addLabel="Přidat otázku"
        renderItem={(q) => (
          <QuestionRow question={q} onChange={(updated) => onChange({ ...data, questions: data.questions.map((x) => (x.id === q.id ? updated : x)) })} />
        )}
      />
      <div className="listening-editor__playcount">
        <label>Počet přehrání:</label>
        <input
          type="number"
          min={1}
          max={3}
          className="admin-input listening-editor__playcount-input"
          value={data.playCount}
          onChange={(e) => onChange({ ...data, playCount: Math.min(3, Math.max(1, Number(e.target.value))) })}
        />
        <span>(1–3)</span>
      </div>
    </GameEditorLayout>
  );
}
