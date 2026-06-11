export type TextComponent = {
  type: 'text';
  value: string;
};

export type InputComponent = {
  type: 'input';
  id: string;
  correct: string;
  acceptAlso?: string[];
  hint?: string;
  evaluation: 'auto' | 'teacher';
};

export type SelectComponent = {
  type: 'select';
  id: string;
  options: string[];
  correct: string;
};

export type SelectBetweenComponent = {
  type: 'select_between';
  id: string;
  options: string[];
  correct: string;
};

export type DragTargetComponent = {
  type: 'drag_target';
  id: string;
  sourceId: string;
  correct: string;
};

export type InlineComponent =
  | TextComponent
  | InputComponent
  | SelectComponent
  | SelectBetweenComponent;

export type ImageComponent = {
  type: 'image';
  id: string;
  url: string;
  caption?: string;
};

export type AudioComponent = {
  type: 'audio';
  id: string;
  url: string;
  title?: string;
};

export type VideoComponent = {
  type: 'video';
  id: string;
  url: string;
  title?: string;
};

export type AnswerComponent = {
  type: 'answer';
  id: string;
  length: 'short' | 'long';
  evaluation: 'auto' | 'teacher';
  placeholder?: string;
};

export type McOption = {
  id: string;
  value: string;
  correct: boolean;
};

export type McComponent = {
  type: 'mc';
  id: string;
  question: string;
  options: McOption[];
  multiple: boolean;
};

export type HighlightNode =
  | { type: 'text'; value: string }
  | { type: 'word'; value: string; correct: boolean };

export type HighlightComponent = {
  type: 'highlight';
  id: string;
  instruction?: string;
  multiple: boolean;
  content: HighlightNode[];
};

export type TableCell =
  | { type: 'static'; value: string }
  | { type: 'input'; component: InputComponent }
  | { type: 'select'; component: SelectComponent }
  | { type: 'select_between'; component: SelectBetweenComponent };

export type TableComponent = {
  type: 'table';
  id: string;
  columns: string[];
  rows: TableCell[][];
};

export type BlockComponent =
  | ImageComponent
  | AudioComponent
  | VideoComponent
  | AnswerComponent
  | TableComponent
  | McComponent
  | HighlightComponent;

export type DragSourceComponent = {
  type: 'drag_source';
  id: string;
  words: string[];
  allowReuse: boolean;
};

export type DragAndDropComponent = {
  type: 'drag_and_drop';
  id: string;
  source: DragSourceComponent;
  targets: DragTargetComponent[];
};

export type CompoundComponent = DragAndDropComponent;

export type InlineContent = {
  type: 'inline';
  id: string;
  nodes: Array<
    | TextComponent
    | InputComponent
    | SelectComponent
    | SelectBetweenComponent
    | DragTargetComponent
  >;
};

export type ExerciseItem =
  | InlineContent
  | ImageComponent
  | AudioComponent
  | VideoComponent
  | AnswerComponent
  | TableComponent
  | McComponent
  | HighlightComponent
  | DragAndDropComponent;

export type Exercise = {
  id: string;
  lessonId: string;
  title: string;
  instructions?: string;
  xp: number;
  items: ExerciseItem[];
};
