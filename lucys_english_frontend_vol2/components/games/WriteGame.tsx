'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Vocabulary } from '@/lib/types/lesson.types';
import { GameMeta, GameResult, shuffle } from '@/lib/games/gameUtils';
import { GameStart, GameResult as ResultScreen, RoundHeader } from './GameShell';

interface Props {
  vocabulary: Vocabulary[];
  game: GameMeta;
  onBack: () => void;
}

type Phase = 'start' | 'play' | 'result';
type AnswerState = 'idle' | 'correct' | 'wrong';

const WORDS_PER_ROUND = 10;

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

export default function WriteGame({ vocabulary, game, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start');
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [input, setInput] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = useCallback(() => {
    const picked = shuffle(vocabulary).slice(0, WORDS_PER_ROUND);
    setWords(picked);
    setIndex(0);
    setCorrect(0);
    setInput('');
    setAnswerState('idle');
    setPhase('play');
  }, [vocabulary]);

  useEffect(() => {
    if (phase === 'play' && answerState === 'idle') {
      inputRef.current?.focus();
    }
  }, [phase, index, answerState]);

  const submit = () => {
    if (answerState !== 'idle' || !input.trim()) return;
    const word = words[index];
    const isCorrect = normalize(input) === normalize(word.english);
    const newCorrect = isCorrect ? correct + 1 : correct;
    setAnswerState(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      if (index + 1 >= words.length) {
        setCorrect(newCorrect);
        setPhase('result');
      } else {
        setCorrect(newCorrect);
        setIndex(index + 1);
        setInput('');
        setAnswerState('idle');
      }
    }, 1200);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit();
  };

  const result: GameResult = { correct, total: words.length };

  if (phase === 'start') {
    return <GameStart game={game} wordCount={vocabulary.length} onStart={startGame} onBack={onBack} />;
  }

  if (phase === 'result') {
    return <ResultScreen result={result} game={game} onRestart={startGame} onBack={onBack} />;
  }

  const word = words[index];

  return (
    <div className="game-shell">
      <RoundHeader
        current={index + 1}
        total={words.length}
        correct={correct}
        onExit={onBack}
        gameName={game.title}
      />

      <div className="write-area">
        <div className="write-question-card">
          <p className="write-prompt">Napiš anglicky:</p>
          <p className="write-word">{word.czech}</p>
          {word.note && <p className="write-note">{word.note}</p>}
        </div>

        <div className={`write-input-wrap ${answerState === 'correct' ? 'write-input-wrap--correct' : answerState === 'wrong' ? 'write-input-wrap--wrong' : ''}`}>
          <input
            ref={inputRef}
            className="write-input"
            type="text"
            value={input}
            onChange={(e) => answerState === 'idle' && setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Anglický překlad..."
            disabled={answerState !== 'idle'}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className={`btn btn-${game.color}`}
            onClick={submit}
            disabled={answerState !== 'idle' || !input.trim()}
          >
            Potvrdit
          </button>
        </div>

        {answerState === 'correct' && (
          <div className="write-feedback write-feedback--correct">✓ Správně!</div>
        )}
        {answerState === 'wrong' && (
          <div className="write-feedback write-feedback--wrong">
            ✕ Správná odpověď: <strong>{word.english}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
