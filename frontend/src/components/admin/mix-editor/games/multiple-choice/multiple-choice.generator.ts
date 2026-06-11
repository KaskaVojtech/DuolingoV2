import { v4 as uuid } from 'uuid';
import { MCOption, MCQuestion, MultipleChoiceData } from './multiple-choice.types';
import { fail, GenerateContext, GenerateResult, ok, shuffle } from '../shared/generate-result';

export async function autoGenerateMultipleChoice(
  ctx: GenerateContext,
  _existing: MultipleChoiceData[],
): Promise<GenerateResult<MultipleChoiceData>> {
  const { words } = ctx;
  if (words.length < 4) {
    return fail(
      `Pro výběr z možností jsou potřeba alespoň 4 slovíčka kvůli nesprávným možnostem (k dispozici: ${words.length}).`,
    );
  }

  const selected = shuffle(words).slice(0, 5);

  const questions: MCQuestion[] = selected.map((w) => {
    const distractors = shuffle(words.filter((x) => x.id !== w.id))
      .slice(0, 3)
      .map<MCOption>((d) => ({ id: uuid(), text: d.wordCs, isCorrect: false }));

    const correct: MCOption = { id: uuid(), text: w.wordCs, isCorrect: true };
    const options = shuffle([correct, ...distractors]);

    return {
      id: uuid(),
      question: `What does "${w.wordEn}" mean?`,
      options,
    };
  });

  return ok({ questions, randomizeOptions: true });
}
