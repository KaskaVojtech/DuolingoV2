import { MCOption } from '../multiple-choice/multiple-choice.types';

export interface ListeningQuestion {
  id: string;
  audioUrl: string;
  question: string;
  options: MCOption[];
}

export interface ListeningData {
  questions: ListeningQuestion[];
  playCount: number;
}
