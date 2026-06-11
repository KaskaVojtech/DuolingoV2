import { v4 as uuid } from 'uuid';
import { TranslationData, TranslationItem } from './translation.types';
import { fail, GenerateContext, GenerateResult, ok, shuffle } from '../shared/generate-result';

export async function autoGenerateTranslation(
  ctx: GenerateContext,
  existing: TranslationData[],
): Promise<GenerateResult<TranslationData>> {
  const { words } = ctx;
  if (words.length < 3) {
    return fail(`Pro překlad jsou potřeba alespoň 3 slovíčka (k dispozici: ${words.length}).`);
  }

  const variantIndex = existing.length;
  const direction = variantIndex % 2 === 0 ? 'en_to_cs' : 'cs_to_en';

  const selected = shuffle(words).slice(0, 5);
  const items: TranslationItem[] = selected.map((w) => ({
    id: uuid(),
    source: direction === 'en_to_cs' ? w.wordEn : w.wordCs,
    answer: direction === 'en_to_cs' ? w.wordCs : w.wordEn,
    acceptAlso: [],
    direction,
  }));

  return ok({ items, inputType: 'text' });
}
