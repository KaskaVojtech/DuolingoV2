import { v4 as uuid } from 'uuid';
import { WordOrderData, WordOrderSentence } from './word-order.types';
import { fail, GenerateContext, GenerateResult, ok, shuffle } from '../shared/generate-result';

function toWords(sentence: string): string[] {
  return sentence.trim().split(/\s+/).filter(Boolean);
}

export async function autoGenerateWordOrder(
  ctx: GenerateContext,
  _existing: WordOrderData[],
): Promise<GenerateResult<WordOrderData>> {
  const { words } = ctx;
  if (words.length === 0) {
    return fail('Lekce ani předchozí lekce neobsahují žádná slovíčka.');
  }

  const local: WordOrderSentence[] = shuffle(
    words.filter((w) => w.exampleSentence && toWords(w.exampleSentence).length >= 5),
  )
    .slice(0, 3)
    .map((w) => ({ id: uuid(), words: toWords(w.exampleSentence!), hint: w.wordCs }));

  if (local.length >= 2) {
    return ok({ sentences: local, showHint: true });
  }

  try {
    const llm = await ctx.requestSentences('word_order', 3);
    const generated: WordOrderSentence[] = llm
      .map((item) => ({ id: uuid(), words: toWords(item.sentence), hint: item.hint ?? '' }))
      .filter((s) => s.words.length >= 3);
    const combined = [...local, ...generated];
    if (combined.length >= 1) {
      return ok({ sentences: combined.slice(0, 4), showHint: true });
    }
    return fail('AI nevygenerovala použitelné věty. Zkus generování zopakovat.');
  } catch (err) {
    if (local.length >= 1) {
      return ok({ sentences: local, showHint: true });
    }
    return fail(`Slovíčka nemají dost dlouhé vzorové věty (min. 5 slov). ${(err as Error).message}`);
  }
}
