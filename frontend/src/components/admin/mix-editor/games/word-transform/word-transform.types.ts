export interface WordTransformItem {
  id: string;
  sentence: string;
  baseWord: string;
  answer: string;
  instruction: string;
  acceptAlso: string[];
}

export interface WordTransformData {
  items: WordTransformItem[];
}
