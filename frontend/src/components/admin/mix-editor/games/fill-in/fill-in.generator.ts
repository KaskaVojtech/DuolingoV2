import { v4 as uuid } from 'uuid';
import { VocabularyWord } from '@/lib/vocabulary/vocabulary.types';
import { FillInData, FillInSentence } from './fill-in.types';
import { fail, GenerateContext, GenerateResult, ok, shuffle } from '../shared/generate-result';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function blankOut(sentence: string, word: string): FillInSentence | null {
  const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i');
  if (!regex.test(sentence)) return null;
  return { id: uuid(), sentence: sentence.replace(regex, '{blank}'), answer: word };
}

export async function autoGenerateFillIn(
  ctx: GenerateContext,
  _existing: FillInData[],
): Promise<GenerateResult<FillInData>> {
  const { words } = ctx;
  if (words.length === 0) {
    return fail('Lekce ani předchozí lekce neobsahují žádná slovíčka.');
  }

  const local: FillInSentence[] = [];
  for (const w of shuffle(words.filter((x): x is VocabularyWord & { exampleSentence: string } => !!x.exampleSentence))) {
    const s = blankOut(w.exampleSentence, w.wordEn);
    if (s) local.push(s);
    if (local.length >= 5) break;
  }
  if (local.length >= 3) {
    return ok({ sentences: local, showHints: false });
  }

  try {
    const llm = await ctx.requestSentences('fill_in', 5);
    const generated: FillInSentence[] = [];
    for (const item of llm) {
      const s = item.word ? blankOut(item.sentence, item.word) : null;
      if (s) generated.push(s);
    }
    const combined = [...local, ...generated];
    if (combined.length >= 1) {
      return ok({ sentences: combined.slice(0, 6), showHints: false });
    }
    return fail('AI nevygenerovala použitelné věty. Zkus generování zopakovat.');
  } catch (err) {
    if (local.length >= 1) {
      return ok({ sentences: local, showHints: false });
    }
    return fail(`Slovíčka nemají vzorové věty. ${(err as Error).message}`);
  }
}
