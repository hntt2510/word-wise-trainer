export type TokenStatus = 'pending' | 'active' | 'correct' | 'incorrect' | 'skipped';

export interface Token {
  id: number;
  original: string;
  normalized: string;
  isPunctuation: boolean;
  status: TokenStatus;
  sentenceIndex: number;
}

export interface Sentence {
  id: number;
  text: string;
  status: 'pending' | 'active' | 'correct' | 'incorrect';
  userInput: string;
}

export interface TrainerSettings {
  mode: 'strict' | 'loose';
  showPunctuation: boolean;
  autoAdvance: boolean;
  soundEnabled: boolean;
  allowRewind: boolean;
  inputMode: 'word' | 'sentence'; // Chế độ nhập: từng từ hoặc từng câu
}

export interface TrainerStats {
  startTime: number | null;
  endTime: number | null;
  correctCount: number;
  errorCount: number;
  skippedCount: number;
  totalKeystrokes: number;
}

export interface DictionaryEntry {
  meaning: string;
  pos: string;
  ipa: string;
  example: string;
  collocations?: string[];
  notes?: string;
}

export interface GrammarInfo {
  structure: string;
  explanation: string;
  relatedStructures?: string[];
}

export type TrainerState = {
  originalText: string;
  tokens: Token[];
  sentences: Sentence[];
  activeIndex: number;
  activeSentenceIndex: number;
  typedBuffer: string;
  settings: TrainerSettings;
  stats: TrainerStats;
  isPaused: boolean;
  isStarted: boolean;
  isCompleted: boolean;
  selectedRange: { start: number; end: number } | null;
  isTypingActive: boolean; // Để control focus
};

export type TrainerAction =
  | { type: 'LOAD_TEXT'; payload: string }
  | { type: 'TYPE_CHAR'; payload: string }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SUBMIT_SENTENCE' }
  | { type: 'SUBMIT_TOKEN' }
  | { type: 'BACKSPACE' }
  | { type: 'SKIP_TOKEN' }
  | { type: 'SKIP_SENTENCE' }
  | { type: 'REVEAL_TOKEN' }
  | { type: 'REVEAL_SENTENCE' }
  | { type: 'RESET' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<TrainerSettings> }
  | { type: 'SELECT_RANGE'; payload: { start: number; end: number } | null }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_TYPING_ACTIVE'; payload: boolean };
