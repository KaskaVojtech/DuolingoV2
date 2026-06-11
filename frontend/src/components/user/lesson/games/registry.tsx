/**
 * Registry of game players (maps a game type to its interactive player and metadata).
 */
import { ComponentType } from 'react';
import { GameType } from '@/lib/mix-editor/mix-editor.types';
import { GamePlayerProps } from './game-player.types';
import { FillInPlayer, WordTransformPlayer, TranslationPlayer } from './TextGames';
import { MultipleChoicePlayer, ListeningPlayer } from './ChoiceGames';
import { WordOrderPlayer } from './WordOrderPlayer';
import { ConnectorPlayer } from './ConnectorPlayer';

export interface GamePlayerMeta {
  label: string;
  icon: string;
  color: string;

  Player: ComponentType<GamePlayerProps<any>>;
}

export const GAME_PLAYER_REGISTRY: Record<GameType, GamePlayerMeta> = {
  multiple_choice: { label: 'Výběr z možností', icon: 'ti-list-check',   color: '#5b7cfa', Player: MultipleChoicePlayer },
  fill_in:         { label: 'Doplň slovo',       icon: 'ti-input-search', color: '#22c79a', Player: FillInPlayer },
  word_order:      { label: 'Seřaď slova',        icon: 'ti-reorder',      color: '#c44a2a', Player: WordOrderPlayer },
  connector:       { label: 'Spoj dvojice',       icon: 'ti-arrows-join',  color: '#a855f7', Player: ConnectorPlayer },
  listening:       { label: 'Poslech',            icon: 'ti-headphones',   color: '#f59e0b', Player: ListeningPlayer },
  word_transform:  { label: 'Přetvoř slovo',      icon: 'ti-wand',         color: '#ec4899', Player: WordTransformPlayer },
  translation:     { label: 'Překlad',            icon: 'ti-language',     color: '#0ea5e9', Player: TranslationPlayer },
};
