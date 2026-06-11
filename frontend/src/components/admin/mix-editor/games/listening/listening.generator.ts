import { v4 as uuid } from 'uuid';
import { ListeningData, ListeningQuestion } from './listening.types';
import { MCOption } from '../multiple-choice/multiple-choice.types';
import { fail, GenerateContext, GenerateResult, ok, shuffle } from '../shared/generate-result';

export async function autoGenerateListening(
  ctx: GenerateContext,
  _existing: ListeningData[],
): Promise<GenerateResult<ListeningData>> {
  const { words } = ctx;
  const withAudio = words.filter((w) => w.pronunciationUrl);

  if (withAudio.length === 0) {
    return fail('Žádné slovíčko nemá nahranou výslovnost. Nahraj audio u slovíček a zkus to znovu.');
  }
  if (words.length < 4) {
    return fail(
      `Pro poslech jsou potřeba alespoň 4 slovíčka kvůli nesprávným možnostem (k dispozici: ${words.length}).`,
    );
  }

  const selected = shuffle(withAudio).slice(0, 4);

  const questions: ListeningQuestion[] = selected.map((w) => {
    const distractors = shuffle(words.filter((x) => x.id !== w.id))
      .slice(0, 3)
      .map<MCOption>((d) => ({ id: uuid(), text: d.wordEn, isCorrect: false }));

    const correct: MCOption = { id: uuid(), text: w.wordEn, isCorrect: true };
    const options = shuffle([correct, ...distractors]);

    return {
      id: uuid(),
      audioUrl: w.pronunciationUrl!,
      question: 'What did you hear?',
      options,
    };
  });

  return ok({ questions, playCount: 2 });
}
