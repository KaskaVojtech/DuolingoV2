export interface FillInSentence {
  id: string;
  sentence: string;
  answer: string;
  hint?: string;
}

export interface FillInData {
  sentences: FillInSentence[];
  showHints: boolean;
}
