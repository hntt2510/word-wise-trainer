export interface Lesson {
  id?: string;
  title: string;
  original_text: string;
  created_at?: string;
  updated_at?: string;
  stats?: LessonStats;
  is_completed: boolean;
}

export interface LessonStats {
  wpm: number;
  accuracy: number;
  time_seconds: number;
  correct_count: number;
  error_count: number;
  skipped_count: number;
}

export interface GrammarPattern {
  id: string;
  name: string;
  pattern: string;
  explanation: string;
  vietnamese_explanation: string;
  examples: GrammarExample[];
  related_patterns?: string[];
}

export interface GrammarExample {
  sentence: string;
  translation: string;
  highlight: string; // phần cần highlight trong câu
}

export interface WordAnalysis {
  word: string;
  pos: string;
  pos_vietnamese: string;
  base_form?: string;
  meaning: string;
  ipa?: string;
  grammar_role?: string; // vai trò ngữ pháp trong câu
  grammar_patterns?: GrammarPattern[];
  examples: string[];
  collocations?: string[];
  synonyms?: string[];
  antonyms?: string[];
  notes?: string;
}

export interface SentenceAnalysis {
  sentence: string;
  translation: string;
  structure: string; // e.g., "S + V + O + Adv"
  tense?: string;
  grammar_patterns: GrammarPattern[];
  word_analyses: WordAnalysis[];
}
