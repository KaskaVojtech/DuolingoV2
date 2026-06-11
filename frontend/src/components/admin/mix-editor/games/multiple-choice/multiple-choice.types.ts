export interface MCOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQuestion {
  id: string;
  question: string;
  options: MCOption[];
  imageUrl?: string;
}

export interface MultipleChoiceData {
  questions: MCQuestion[];
  randomizeOptions: boolean;
}
