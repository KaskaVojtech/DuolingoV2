'use client';

import React from 'react';
import { v4 as uuid } from 'uuid';
import { GameEditorProps } from '@/lib/mix-editor/mix-editor.types';
import { MCOption, MCQuestion, MultipleChoiceData } from './multiple-choice.types';
import { GameEditorLayout } from '../shared/GameEditorLayout';
import { GameItemList } from '../shared/GameItemList';

function makeOption(isCorrect = false): MCOption {
  return { id: uuid(), text: '', isCorrect };
}

function makeQuestion(): MCQuestion {
  return {
    id: uuid(),
    question: '',
    options: [makeOption(true), makeOption(), makeOption(), makeOption()],
  };
}

function QuestionRow({
  question,
  onChange,
}: {
  question: MCQuestion;
  onChange: (q: MCQuestion) => void;
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

  return (
    <div className="mc-question">
      <input
        className="admin-input mc-question__text"
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
              title={opt.isCorrect ? 'Správná odpověď' : 'Označit jako správnou'}
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

export default function MultipleChoiceEditor({ data, onChange }: GameEditorProps<MultipleChoiceData>) {
  function updateQuestion(id: string, updated: MCQuestion) {
    onChange({ ...data, questions: data.questions.map((q) => (q.id === id ? updated : q)) });
  }

  return (
    <GameEditorLayout title="Multiple Choice" subtitle="Výběr ze čtyř možností">
      <GameItemList
        items={data.questions}
        onAdd={() => onChange({ ...data, questions: [...data.questions, makeQuestion()] })}
        onRemove={(id) => onChange({ ...data, questions: data.questions.filter((q) => q.id !== id) })}
        minItems={1}
        maxItems={10}
        addLabel="Přidat otázku"
        renderItem={(q) => (
          <QuestionRow question={q} onChange={(updated) => updateQuestion(q.id, updated)} />
        )}
      />
      <label className="mc-editor__toggle">
        <input
          type="checkbox"
          checked={data.randomizeOptions}
          onChange={(e) => onChange({ ...data, randomizeOptions: e.target.checked })}
        />
        {' '}Zamíchat pořadí možností
      </label>
    </GameEditorLayout>
  );
}
