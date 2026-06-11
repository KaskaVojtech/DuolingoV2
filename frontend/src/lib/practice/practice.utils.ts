import { PRACTICE_DEFINITIONS, PracticeType } from './practice.types';

interface WordCounts {
  wordCount: number;
  wordsWithAudio: number;
  wordsWithSentences: number;
}

export function computePracticeAvailability(
  type: PracticeType,
  config: WordCounts
): { isAvailable: boolean; unavailableReason: string | null } {
  const def = PRACTICE_DEFINITIONS[type];

  if (config.wordCount < 4) {
    return { isAvailable: false, unavailableReason: 'Málo slovíček (min. 4)' };
  }

  if (def.requiresAudio && config.wordsWithAudio < 2) {
    return { isAvailable: false, unavailableReason: 'Chybí audio (min. 2 slovíčka s výslovností)' };
  }

  if (def.requiresSentences && config.wordsWithSentences < 2) {
    return { isAvailable: false, unavailableReason: 'Chybí příkladové věty (min. 2)' };
  }

  return { isAvailable: true, unavailableReason: null };
}

export function formatLastGenerated(isoDate: string | null): string {
  if (!isoDate) return 'Nikdy';
  const d = new Date(isoDate);
  return d.toLocaleString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
