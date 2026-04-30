'use client';

import React from 'react';
import { GameMeta } from '@/lib/games/gameUtils';

interface Props {
  game: GameMeta;
  available: boolean;
  minWords: number;
  onClick: () => void;
}

export default function GameCard({ game, available, minWords, onClick }: Props) {
  return (
    <button
      className={`game-card game-card--${game.color} ${!available ? 'game-card--disabled' : ''}`}
      onClick={available ? onClick : undefined}
      disabled={!available}
      title={!available ? `Potřeba alespoň ${minWords} slovíček` : ''}
    >
      <div className="game-card-icon">{game.icon}</div>
      <h3 className="game-card-title">{game.title}</h3>
      <p className="game-card-desc">{game.description}</p>
      {!available && (
        <p className="game-card-unavailable">Min. {minWords} slovíček</p>
      )}
      {available && (
        <span className="game-card-play">Hrát →</span>
      )}
    </button>
  );
}
