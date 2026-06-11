/**
 * Generates sentences for the fill_in and word_order games using the LLM over the lesson's cumulative vocabulary; validates and filters the output.
 */
import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { VocabularyService } from '../vocabulary/vocabulary.service';
import { LlmService } from '../llm/llm.service';

export type SentenceKind = 'fill_in' | 'word_order' | 'word_transform';

interface GenWord {
  wordEn: string;
  wordCs: string;
  pos: string;
}

export interface FillInSentence {
  word: string;
  sentence: string;
}

export interface WordOrderSentence {
  sentence: string;
  hint: string;
}

@Injectable()
export class MixGenerationService {
  constructor(
    private readonly vocab: VocabularyService,
    private readonly llm: LlmService,
  ) {}

  private async loadWords(lessonId: string): Promise<GenWord[]> {
    const words = await this.vocab.getCumulativeWords(lessonId);
    if (!words.length) {
      throw new BadRequestException(
        'Lekce ani předchozí lekce neobsahují žádná slovíčka. Nejdřív přidej slovní zásobu.',
      );
    }
    return words;
  }

  private pick(words: GenWord[], count: number): GenWord[] {
    const a = [...words];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, count);
  }

  async generateFillIn(lessonId: string, count: number): Promise<FillInSentence[]> {
    const words = await this.loadWords(lessonId);
    await this.llm.assertReady();

    const selected = this.pick(words, Math.min(count, 8));
    const list = selected.map((w, i) => `${i + 1}. ${w.wordEn} (${w.wordCs})`).join('\n');

    const system =
      'You write very simple English sentences for beginner language learners. ' +
      'Each sentence must be short (5 to 9 words) and use the target word exactly once, ' +
      'in its given base form (do not conjugate or change the word).';
    const prompt =
      `For each English word below, write one simple sentence that contains that exact word.\n` +
      `Words:\n${list}`;

    const out = await this.llm.generateJson<{ sentences?: FillInSentence[] }>(prompt, {
      system,
      schema: {
        type: 'object',
        properties: {
          sentences: {
            type: 'array',
            items: {
              type: 'object',
              properties: { word: { type: 'string' }, sentence: { type: 'string' } },
              required: ['word', 'sentence'],
            },
          },
        },
        required: ['sentences'],
      },
    });
    const valid = (out.sentences ?? []).filter(
      (s) =>
        s &&
        typeof s.word === 'string' &&
        typeof s.sentence === 'string' &&
        new RegExp(`\\b${escapeRegex(s.word)}\\b`, 'i').test(s.sentence),
    );
    if (!valid.length) {
      throw new ServiceUnavailableException(
        'AI nevygenerovala použitelné věty. Zkus generování zopakovat.',
      );
    }
    return valid;
  }

  async generateWordOrder(lessonId: string, count: number): Promise<WordOrderSentence[]> {
    const words = await this.loadWords(lessonId);
    await this.llm.assertReady();

    const selected = this.pick(words, Math.min(Math.max(count, 3), 6));
    const list = selected.map((w, i) => `${i + 1}. ${w.wordEn} (${w.wordCs})`).join('\n');

    const system =
      'You write very simple English sentences for beginner language learners. ' +
      'Each sentence must have between 5 and 8 words and be grammatically correct. ' +
      'The "hint" must be the Czech translation of the sentence, nothing else.';
    const prompt =
      `Using some of the vocabulary below, write ${selected.length} simple English sentences.\n` +
      `For each one, set "hint" to its Czech translation.\n` +
      `Vocabulary:\n${list}`;

    const out = await this.llm.generateJson<{ sentences?: WordOrderSentence[] }>(prompt, {
      system,
      schema: {
        type: 'object',
        properties: {
          sentences: {
            type: 'array',
            items: {
              type: 'object',
              properties: { sentence: { type: 'string' }, hint: { type: 'string' } },
              required: ['sentence', 'hint'],
            },
          },
        },
        required: ['sentences'],
      },
    });
    const valid = (out.sentences ?? []).filter(
      (s) =>
        s &&
        typeof s.sentence === 'string' &&
        s.sentence.trim().split(/\s+/).length >= 4 &&
        typeof s.hint === 'string',
    );
    if (!valid.length) {
      throw new ServiceUnavailableException(
        'AI nevygenerovala použitelné věty. Zkus generování zopakovat.',
      );
    }
    return valid;
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
