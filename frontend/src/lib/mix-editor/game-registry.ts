/**
 * Registry of game plugins (maps a game type to its plugin) for the Mix editor.
 */
import { ConnectorPlugin } from '@/components/admin/mix-editor/games/connector/connector.plugin';
import { FillInPlugin } from '@/components/admin/mix-editor/games/fill-in/fill-in.plugin';
import { MultipleChoicePlugin } from '@/components/admin/mix-editor/games/multiple-choice/multiple-choice.plugin';
import { ListeningPlugin } from '@/components/admin/mix-editor/games/listening/listening.plugin';
import { WordOrderPlugin } from '@/components/admin/mix-editor/games/word-order/word-order.plugin';
import { TranslationPlugin } from '@/components/admin/mix-editor/games/translation/translation.plugin';
import { WordTransformPlugin } from '@/components/admin/mix-editor/games/word-transform/word-transform.plugin';
import { GamePluginRegistry } from './mix-editor.types';

export const GAME_REGISTRY: GamePluginRegistry = {

  connector:       ConnectorPlugin as any,

  fill_in:         FillInPlugin as any,

  multiple_choice: MultipleChoicePlugin as any,

  listening:       ListeningPlugin as any,

  word_order:      WordOrderPlugin as any,

  translation:     TranslationPlugin as any,

  word_transform:  WordTransformPlugin as any,
};
