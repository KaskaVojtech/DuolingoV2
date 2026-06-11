import { v4 as uuid } from 'uuid';
import { ConnectorData, ConnectorPair } from './connector.types';
import { fail, GenerateContext, GenerateResult, ok, shuffle } from '../shared/generate-result';

const PAIR_COLORS = ['#1a7a6e', '#1a6fd4', '#c47c1a', '#c44a2a', '#6a3db8', '#2d7a4a', '#b43d6a'];

export async function autoGenerateConnector(
  ctx: GenerateContext,
  existing: ConnectorData[],
): Promise<GenerateResult<ConnectorData>> {
  const { words } = ctx;
  if (words.length < 3) {
    return fail(`Pro spojovačku jsou potřeba alespoň 3 slovíčka (k dispozici: ${words.length}).`);
  }

  const usedWords = new Set<string>();
  for (const v of existing) {
    for (const p of v.pairs) usedWords.add(p.left.toLowerCase());
  }

  let available = words.filter((w) => !usedWords.has(w.wordEn.toLowerCase()));
  if (available.length < 3) available = [...words];

  const selected = shuffle(available).slice(0, 5);
  const pairs: ConnectorPair[] = selected.map((w, i) => ({
    id: uuid(),
    left: w.wordEn,
    right: w.wordCs,
    color: PAIR_COLORS[i % PAIR_COLORS.length],
  }));

  return ok({ pairs, leftLabel: 'Anglicky', rightLabel: 'Česky', rightType: 'text' });
}
