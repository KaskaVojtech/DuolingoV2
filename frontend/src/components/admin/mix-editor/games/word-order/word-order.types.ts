export interface WordOrderSentence {
  id: string;
  words: string[];
  hint?: string;
}

export interface WordOrderData {
  sentences: WordOrderSentence[];
  showHint: boolean;
}
