'use client';

import React, { useState, useCallback } from 'react';
import { Vocabulary } from '@/lib/types/lesson.types';
import { GameMeta, GameResult, shuffle } from '@/lib/games/gameUtils';
import { GameStart, GameResult as ResultScreen, RoundHeader } from './GameShell';

interface Props {
  vocabulary: Vocabulary[];
  game: GameMeta;
  onBack: () => void;
}

type Phase = 'start' | 'play' | 'result';

const CARDS_PER_ROUND = 10;

export default function FlashCardsGame({ vocabulary, game, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('start');
  const [cards, setCards] = useState<Vocabulary[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);

  const startGame = useCallback(() => {
    const picked = shuffle(vocabulary).slice(0, CARDS_PER_ROUND);
    setCards(picked);
    setIndex(0);
    setFlipped(false);
    setCorrect(0);
    setPhase('play');
  }, [vocabulary]);

  const handleAnswer = (knew: boolean) => {
    const newCorrect = knew ? correct + 1 : correct;
    if (index + 1 >= cards.length) {
      setCorrect(newCorrect);
      setPhase('result');
    } else {
      setCorrect(newCorrect);
      setIndex(index + 1);
      setFlipped(false);
    }
  };

  const result: GameResult = { correct, total: cards.length };

  if (phase === 'start') {
    return <GameStart game={game} wordCount={vocabulary.length} onStart={startGame} onBack={onBack} />;
  }

  if (phase === 'result') {
    return (
      <ResultScreen result={result} game={game} onRestart={startGame} onBack={onBack} />
    );
  }

  const card = cards[index];

  return (
    <div className="game-shell">
      <RoundHeader
        current={index + 1}
        total={cards.length}
        correct={correct}
        onExit={onBack}
        gameName={game.title}
      />

      <div className="flashcard-area">
        <div
          className={`flashcard ${flipped ? 'flashcard--flipped' : ''}`}
          onClick={() => setFlipped(true)}
        >
          <div className="flashcard-front">
            <span className="flashcard-lang">🇨🇿 Česky</span>
            <p className="flashcard-word">{card.czech}</p>
            {!flipped && <p className="flashcard-hint">Klikni pro otočení</p>}
          </div>
          <div className="flashcard-back">
            <span className="flashcard-lang">🇬🇧 Anglicky</span>
            <p className="flashcard-word">{card.english}</p>
            {card.note && <p className="flashcard-note">{card.note}</p>}
          </div>
        </div>

        {flipped && (
          <div className="flashcard-actions">
            <button className="flashcard-btn flashcard-btn--no" onClick={() => handleAnswer(false)}>
              ✕ Nevěděl/a
            </button>
            <button className="flashcard-btn flashcard-btn--yes" onClick={() => handleAnswer(true)}>
              ✓ Věděl/a
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
