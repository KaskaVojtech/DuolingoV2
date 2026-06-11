'use client';

import React from 'react';

interface GameEditorLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function GameEditorLayout({ title, subtitle, children }: GameEditorLayoutProps) {
  return (
    <div className="game-editor-layout">
      <div className="game-editor-layout__header">
        <h2 className="game-editor-layout__title">{title}</h2>
        {subtitle && <p className="game-editor-layout__subtitle">{subtitle}</p>}
      </div>
      <div className="game-editor-layout__body">{children}</div>
    </div>
  );
}
