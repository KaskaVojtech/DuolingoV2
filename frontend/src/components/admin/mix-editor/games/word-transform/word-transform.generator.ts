import { v4 as uuid } from 'uuid';
import { WordTransformData, WordTransformItem } from './word-transform.types';
import { fail, GenerateContext, GenerateResult, ok, shuffle } from '../shared/generate-result';

export async function autoGenerateWordTransform(
  ctx: GenerateContext,
  _existing: WordTransformData[],
): Promise<GenerateResult<WordTransformData>> {
  const { words } = ctx;
  const eligible = words.filter((w) => w.pos === 'verb' || w.pos === 'adjective');

  if (eligible.length === 0) {
    return fail(
      'Žádné slovíčko není sloveso ani přídavné jméno. Pro tvarosloví nastav slovní druh u slovíček.',
    );
  }

  const source = shuffle(eligible).slice(0, 4);

  const items: WordTransformItem[] = source.map((w) => {
    const isVerb = w.pos === 'verb';
    return {
      id: uuid(),
      sentence: `She {word} every day.`,
      baseWord: w.wordEn,
      answer: isVerb ? `${w.wordEn}s` : `${w.wordEn}er`,
      instruction: isVerb
        ? 'Dej do 3. osoby jednotného čísla přítomného času'
        : 'Dej do komparativu',
      acceptAlso: [],
    };
  });

  return ok({ items });
}
