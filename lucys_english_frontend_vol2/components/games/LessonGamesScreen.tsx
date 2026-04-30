'use client';

import React, { useState, useEffect } from 'react';
import { Vocabulary } from '@/lib/types/lesson.types';
import { LessonsApi } from '@/lib/api/lessons.api';
import { GAMES, GameType, canPlayGame } from '@/lib/games/gameUtils';
import GameCard from './GameCard';
import FlashCardsGame from './FlashCardsGame';
import MatchingGame from './MatchingGame';
import FillInGame from './FillInGame';
import WriteGame from './WriteGame';

interface Props {
  lessonId: number;
  lessonTitle: string;
  onBack: () => void;
}

type Screen = 'overview' | GameType;

export default function LessonGamesScreen({ lessonId, lessonTitle, onBack }: Props) {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>('overview');

  useEffect(() => {
    LessonsApi.getVocabulary(lessonId)
      .then((items) => setVocabulary(items.map((i) => i.vocabulary)))
      .catch(() => setVocabulary([]))
      .finally(() => setLoading(false));
  }, [lessonId]);

  // When user finishes / exits a game → back to overview
  const backToOverview = () => setScreen('overview');

  if (screen !== 'overview') {
    const game = GAMES.find((g) => g.id === screen)!;
    const commonProps = { vocabulary, game, onBack: backToOverview };

    switch (screen) {
      case 'flashcards':
        return <FlashCardsGame {...commonProps} />;
      case 'matching':
        return <MatchingGame {...commonProps} />;
      case 'fillin':
        return <FillInGame {...commonProps} />;
      case 'write':
        return <WriteGame {...commonProps} />;
    }
  }

  return (
    <div className="lesson-games-screen">
      {/* Header */}
      <div className="lesson-games-header">
        <button className="vocab-btn vocab-btn-edit" onClick={onBack}>
          ← Zpět na kurz
        </button>
        <div>
          <h1 className="home-heading" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', margin: 0 }}>
            {lessonTitle}
          </h1>
          <p style={{ color: 'var(--gray)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            Vyberte cvičení
          </p>
        </div>
      </div>

      {/* Vocabulary count badge */}
      {!loading && (
        <div className="lesson-games-badge">
          <span>📚</span>
          <span>
            {vocabulary.length === 0
              ? 'Lekce nemá žádná slovíčka'
              : `${vocabulary.length} slovíček v lekci`}
          </span>
        </div>
      )}

      {loading && (
        <p style={{ color: 'var(--gray)', marginTop: '2rem' }}>Načítání slovíček...</p>
      )}

      {!loading && (
        <div className="games-grid">
          {GAMES.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              available={canPlayGame(game, vocabulary)}
              minWords={game.minWords}
              onClick={() => setScreen(game.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
