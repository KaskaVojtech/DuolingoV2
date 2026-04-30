'use client';

import React, { useState, useCallback } from 'react';
import { Vocabulary } from '@/lib/types/lesson.types';
import { GameMeta, GameResult, shuffle, pickRandom } from '@/lib/games/gameUtils';
import { GameStart, GameResult as ResultScreen, RoundHeader } from './GameShell';

interface Props {
  vocabulary: Vocabulary[];
  game: GameMeta;
  onBack: () => void;
}

type Phase = 'start' | 'play' | 'result';

const PAIRS_PER_ROUND = 6;

interface MatchState {
  words: Vocabulary[];
  leftOrder: number[];   // indices into words
  rightOrder: number[];  // indices into words (shuffled separately)
  selectedLeft: number | null;
  selectedRight: number | null;
  matched: Set<number>;  // matched word indices
  wrong: { l: number | null; r: number | null };
}

export default function MatchingGame({ vocabulary, game, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start');
  const [state, setState] = useState<MatchState | null>(null);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);

  const buildRound = useCallback((words: Vocabulary[]) => {
    const n = words.length;
    return {
      words,
      leftOrder: shuffle([...Array(n).keys()]),
      rightOrder: shuffle([...Array(n).keys()]),
      selectedLeft: null,
      selectedRight: null,
      matched: new Set<number>(),
      wrong: { l: null, r: null },
    };
  }, []);

  const startGame = useCallback(() => {
    const picked = pickRandom(vocabulary, PAIRS_PER_ROUND);
    const rounds = Math.ceil(vocabulary.length / PAIRS_PER_ROUND);
    setState(buildRound(picked));
    setRoundCorrect(0);
    setTotalRounds(rounds);
    setPhase('play');
  }, [vocabulary, buildRound]);

  const handleLeft = (idx: number) => {
    if (!state) return;
    if (state.matched.has(idx) || state.wrong.l !== null) return;
    setState(s => s ? { ...s, selectedLeft: idx, wrong: { l: null, r: null } } : s);
    checkMatch(idx, state.selectedRight, state);
  };

  const handleRight = (idx: number) => {
    if (!state) return;
    if (state.matched.has(idx) || state.wrong.r !== null) return;
    setState(s => s ? { ...s, selectedRight: idx, wrong: { l: null, r: null } } : s);
    checkMatch(state.selectedLeft, idx, state);
  };

  const checkMatch = (left: number | null, right: number | null, s: MatchState) => {
    if (left === null || right === null) return;
    if (left === right) {
      // correct!
      const newMatched = new Set(s.matched);
      newMatched.add(left);
      const newCorrect = roundCorrect + 1;
      setRoundCorrect(newCorrect);
      if (newMatched.size === s.words.length) {
        // round done
        setTimeout(() => setPhase('result'), 600);
      }
      setState(prev => prev ? {
        ...prev,
        matched: newMatched,
        selectedLeft: null,
        selectedRight: null,
        wrong: { l: null, r: null },
      } : prev);
    } else {
      // wrong
      setState(prev => prev ? {
        ...prev,
        wrong: { l: left, r: right },
      } : prev);
      setTimeout(() => {
        setState(prev => prev ? {
          ...prev,
          selectedLeft: null,
          selectedRight: null,
          wrong: { l: null, r: null },
        } : prev);
      }, 800);
    }
  };

  const result: GameResult = { correct: roundCorrect, total: state?.words.length ?? 0 };

  if (phase === 'start') {
    return <GameStart game={game} wordCount={vocabulary.length} onStart={startGame} onBack={onBack} />;
  }

  if (phase === 'result') {
    return <ResultScreen result={result} game={game} onRestart={startGame} onBack={onBack} />;
  }

  if (!state) return null;

  return (
    <div className="game-shell">
      <RoundHeader
        current={state.matched.size}
        total={state.words.length}
        correct={roundCorrect}
        onExit={onBack}
        gameName={game.title}
      />

      <div className="matching-area">
        <div className="matching-column">
          {state.leftOrder.map((wordIdx) => {
            const word = state.words[wordIdx];
            const isMatched = state.matched.has(wordIdx);
            const isSelected = state.selectedLeft === wordIdx;
            const isWrong = state.wrong.l === wordIdx;
            return (
              <button
                key={`l-${wordIdx}`}
                className={`matching-tile ${isMatched ? 'matching-tile--matched' : ''} ${isSelected ? 'matching-tile--selected' : ''} ${isWrong ? 'matching-tile--wrong' : ''}`}
                onClick={() => !isMatched && handleLeft(wordIdx)}
                disabled={isMatched}
              >
                {word.czech}
              </button>
            );
          })}
        </div>

        <div className="matching-divider">↔</div>

        <div className="matching-column">
          {state.rightOrder.map((wordIdx) => {
            const word = state.words[wordIdx];
            const isMatched = state.matched.has(wordIdx);
            const isSelected = state.selectedRight === wordIdx;
            const isWrong = state.wrong.r === wordIdx;
            return (
              <button
                key={`r-${wordIdx}`}
                className={`matching-tile ${isMatched ? 'matching-tile--matched' : ''} ${isSelected ? 'matching-tile--selected' : ''} ${isWrong ? 'matching-tile--wrong' : ''}`}
                onClick={() => !isMatched && handleRight(wordIdx)}
                disabled={isMatched}
              >
                {word.english}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
