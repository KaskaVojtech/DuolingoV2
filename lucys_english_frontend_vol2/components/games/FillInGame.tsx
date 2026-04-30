'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Vocabulary } from '@/lib/types/lesson.types';
import { GameMeta, GameResult, shuffle, pickRandom } from '@/lib/games/gameUtils';
import { GameStart, GameResult as ResultScreen, RoundHeader } from './GameShell';

interface Props {
  vocabulary: Vocabulary[];
  game: GameMeta;
  onBack: () => void;
}

type Phase = 'start' | 'play' | 'result';

const QUESTIONS_PER_ROUND = 10;
const OPTIONS_COUNT = 4;

interface Question {
  word: Vocabulary;
  options: string[]; // english options
  correctIndex: number;
}

function buildQuestions(vocabulary: Vocabulary[]): Question[] {
  const pool = shuffle(vocabulary).slice(0, QUESTIONS_PER_ROUND);
  return pool.map((word) => {
    const distractors = vocabulary
      .filter((v) => v.id !== word.id)
      .map((v) => v.english);
    const shuffledDistractors = shuffle(distractors).slice(0, OPTIONS_COUNT - 1);
    const options = shuffle([word.english, ...shuffledDistractors]);
    return {
      word,
      options,
      correctIndex: options.indexOf(word.english),
    };
  });
}

export default function FillInGame({ vocabulary, game, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const startGame = useCallback(() => {
    const qs = buildQuestions(vocabulary);
    setQuestions(qs);
    setIndex(0);
    setCorrect(0);
    setSelected(null);
    setPhase('play');
  }, [vocabulary]);

  const handleOption = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const isCorrect = optIdx === questions[index].correctIndex;
    const newCorrect = isCorrect ? correct + 1 : correct;
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setCorrect(newCorrect);
        setPhase('result');
      } else {
        setCorrect(newCorrect);
        setIndex(index + 1);
        setSelected(null);
      }
    }, 900);
  };

  const result: GameResult = { correct, total: questions.length };

  if (phase === 'start') {
    return <GameStart game={game} wordCount={vocabulary.length} onStart={startGame} onBack={onBack} />;
  }

  if (phase === 'result') {
    return <ResultScreen result={result} game={game} onRestart={startGame} onBack={onBack} />;
  }

  const q = questions[index];

  return (
    <div className="game-shell">
      <RoundHeader
        current={index + 1}
        total={questions.length}
        correct={correct}
        onExit={onBack}
        gameName={game.title}
      />

      <div className="fillin-area">
        <div className="fillin-question-card">
          <p className="fillin-prompt">Co znamená slovíčko:</p>
          <p className="fillin-word">{q.word.czech}</p>
          {q.word.note && <p className="fillin-note">{q.word.note}</p>}
        </div>

        <div className="fillin-options">
          {q.options.map((opt, i) => {
            let cls = 'fillin-option';
            if (selected !== null) {
              if (i === q.correctIndex) cls += ' fillin-option--correct';
              else if (i === selected) cls += ' fillin-option--wrong';
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleOption(i)}
                disabled={selected !== null}
              >
                <span className="fillin-option-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
