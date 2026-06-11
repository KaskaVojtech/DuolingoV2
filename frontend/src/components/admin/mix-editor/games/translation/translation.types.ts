export interface TranslationItem {
  id: string;
  source: string;
  answer: string;
  acceptAlso: string[];
  direction: 'en_to_cs' | 'cs_to_en';
}

export interface TranslationData {
  items: TranslationItem[];
  inputType: 'text' | 'voice';
}
