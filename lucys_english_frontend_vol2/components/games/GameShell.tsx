'use client';

import React from 'react';
import type { GameMeta, GameResult } from '@/lib/games/gameUtils';
// ── START SCREEN ──────────────────────────────────────────────────────────────
interface StartProps {
  game: GameMeta;
  wordCount: number;
  onStart: () => void;
  onBack: () => void;
}

export function GameStart({ game, wordCount, onStart, onBack }: StartProps) {
  return (
    <div className="game-shell">
      <div className="game-start-card">
        <div className="game-start-icon">{game.icon}</div>
        <h2 className="game-start-title">{game.title}</h2>
        <p className="game-start-desc">{game.description}</p>
        <p className="game-start-meta">Lekce obsahuje <strong>{wordCount}</strong> slovíček</p>
        <div className="game-start-actions">
          <button className="btn btn-outline" onClick={onBack}>← Zpět</button>
          <button className={`btn btn-${game.color}`} onClick={onStart}>Spustit hru</button>
        </div>
      </div>
    </div>
  );
}

// ── RESULT SCREEN ─────────────────────────────────────────────────────────────
interface ResultProps {
  result: GameResult;
  game: GameMeta;
  onRestart: () => void;
  onBack: () => void;
}

export function GameResult({ result, game, onRestart, onBack }: ResultProps) {
  const pct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
  const emoji = pct === 100 ? '🏆' : pct >= 70 ? '👍' : pct >= 40 ? '😐' : '💪';
  const msg =
    pct === 100
      ? 'Perfektní výsledek!'
      : pct >= 70
        ? 'Výborně!'
        : pct >= 40
          ? 'Dobrý začátek!'
          : 'Nevzdávej to!';

  return (
    <div className="game-shell">
      <div className="game-result-card">
        <div className="game-result-emoji">{emoji}</div>
        <h2 className="game-result-title">{msg}</h2>
        <div className="game-result-score">
          <span className="game-result-big">{result.correct}</span>
          <span className="game-result-sep">/ {result.total}</span>
        </div>
        <div className="game-result-bar-wrap">
          <div className="game-result-bar" style={{ width: `${pct}%` }} />
        </div>
        <p className="game-result-pct">{pct} % správně</p>
        <div className="game-start-actions">
          <button className="btn btn-outline" onClick={onBack}>← Na lekci</button>
          <button className={`btn btn-${game.color}`} onClick={onRestart}>Hrát znovu</button>
        </div>
      </div>
    </div>
  );
}

// ── ROUND HEADER ──────────────────────────────────────────────────────────────
interface RoundHeaderProps {
  current: number;
  total: number;
  correct: number;
  onExit: () => void;
  gameName: string;
}

export function RoundHeader({ current, total, correct, onExit, gameName }: RoundHeaderProps) {
  return (
    <div className="game-round-header">
      <button className="game-exit-btn" onClick={onExit}>✕</button>
      <div className="game-round-info">
        <span className="game-round-name">{gameName}</span>
        <span className="game-round-progress">{current} / {total}</span>
      </div>
      <div className="game-round-score">✓ {correct}</div>
    </div>
  );
}
