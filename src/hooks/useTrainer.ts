import { useReducer, useCallback, useEffect } from 'react';
import { TrainerState, TrainerAction, Token, Sentence, TrainerSettings, TrainerStats } from '@/types/trainer';
import { tokenize, extractSentences } from '@/utils/tokenizer';

const DEFAULT_SETTINGS: TrainerSettings = {
  mode: 'loose',
  showPunctuation: true,
  autoAdvance: true,
  soundEnabled: false,
  allowRewind: false,
  inputMode: 'sentence', // Mặc định là nhập từng câu
};

const DEFAULT_STATS: TrainerStats = {
  startTime: null,
  endTime: null,
  correctCount: 0,
  errorCount: 0,
  skippedCount: 0,
  totalKeystrokes: 0,
};

const initialState: TrainerState = {
  originalText: '',
  tokens: [],
  sentences: [],
  activeIndex: 0,
  activeSentenceIndex: 0,
  typedBuffer: '',
  settings: DEFAULT_SETTINGS,
  stats: DEFAULT_STATS,
  isPaused: false,
  isStarted: false,
  isCompleted: false,
  selectedRange: null,
  isTypingActive: false,
};

function getNextActiveIndex(tokens: Token[], currentIndex: number, showPunctuation: boolean): number {
  let nextIndex = currentIndex + 1;
  while (nextIndex < tokens.length) {
    if (showPunctuation || !tokens[nextIndex].isPunctuation) {
      return nextIndex;
    }
    tokens[nextIndex].status = 'correct';
    nextIndex++;
  }
  return nextIndex;
}

function normalizeForComparison(text: string, mode: 'strict' | 'loose'): string {
  if (mode === 'strict') {
    return text.trim();
  }
  return text.toLowerCase().trim();
}

function createSentences(text: string): Sentence[] {
  const rawSentences = extractSentences(text);
  return rawSentences.map((s, idx) => ({
    id: idx,
    text: s.trim(),
    status: idx === 0 ? 'active' : 'pending',
    userInput: '',
  }));
}

function trainerReducer(state: TrainerState, action: TrainerAction): TrainerState {
  switch (action.type) {
    case 'LOAD_TEXT': {
      const tokens = tokenize(action.payload);
      const sentences = createSentences(action.payload);
      
      let activeIndex = 0;
      if (!state.settings.showPunctuation) {
        while (activeIndex < tokens.length && tokens[activeIndex].isPunctuation) {
          tokens[activeIndex].status = 'correct';
          activeIndex++;
        }
      }
      
      if (activeIndex < tokens.length) {
        tokens[activeIndex].status = 'active';
      }
      
      return {
        ...state,
        originalText: action.payload,
        tokens,
        sentences,
        activeIndex,
        activeSentenceIndex: 0,
        typedBuffer: '',
        stats: DEFAULT_STATS,
        isPaused: false,
        isStarted: false,
        isCompleted: false,
        selectedRange: null,
        isTypingActive: false,
      };
    }

    case 'SET_TYPING_ACTIVE': {
      return { ...state, isTypingActive: action.payload };
    }

    case 'SET_INPUT': {
      const newStats = { ...state.stats };
      if (!state.isStarted && action.payload.length > 0) {
        newStats.startTime = Date.now();
      }
      newStats.totalKeystrokes++;
      
      return {
        ...state,
        typedBuffer: action.payload,
        stats: newStats,
        isStarted: action.payload.length > 0 || state.isStarted,
      };
    }

    case 'SUBMIT_SENTENCE': {
      if (state.isPaused || state.isCompleted) return state;
      if (state.activeSentenceIndex >= state.sentences.length) return state;
      
      const currentSentence = state.sentences[state.activeSentenceIndex];
      const userInput = state.typedBuffer.trim();
      const targetText = currentSentence.text;
      
      const normalizedInput = normalizeForComparison(userInput, state.settings.mode);
      const normalizedTarget = normalizeForComparison(targetText, state.settings.mode);
      
      const isCorrect = normalizedInput === normalizedTarget;
      const newSentences = [...state.sentences];
      const newStats = { ...state.stats };
      
      newSentences[state.activeSentenceIndex] = {
        ...currentSentence,
        status: isCorrect ? 'correct' : 'incorrect',
        userInput,
      };
      
      if (isCorrect) {
        newStats.correctCount++;
      } else {
        newStats.errorCount++;
      }
      
      const nextIndex = state.activeSentenceIndex + 1;
      
      if (nextIndex >= newSentences.length) {
        newStats.endTime = Date.now();
        return {
          ...state,
          sentences: newSentences,
          activeSentenceIndex: nextIndex,
          typedBuffer: '',
          stats: newStats,
          isCompleted: true,
        };
      }
      
      newSentences[nextIndex] = { ...newSentences[nextIndex], status: 'active' };
      
      return {
        ...state,
        sentences: newSentences,
        activeSentenceIndex: nextIndex,
        typedBuffer: '',
        stats: newStats,
      };
    }

    case 'SKIP_SENTENCE': {
      if (state.isPaused || state.isCompleted) return state;
      if (state.activeSentenceIndex >= state.sentences.length) return state;
      
      const newSentences = [...state.sentences];
      const newStats = { ...state.stats };
      
      newSentences[state.activeSentenceIndex] = {
        ...newSentences[state.activeSentenceIndex],
        status: 'incorrect',
        userInput: '[Skipped]',
      };
      newStats.skippedCount++;
      
      const nextIndex = state.activeSentenceIndex + 1;
      
      if (nextIndex >= newSentences.length) {
        newStats.endTime = Date.now();
        return {
          ...state,
          sentences: newSentences,
          activeSentenceIndex: nextIndex,
          typedBuffer: '',
          stats: newStats,
          isCompleted: true,
        };
      }
      
      newSentences[nextIndex] = { ...newSentences[nextIndex], status: 'active' };
      
      return {
        ...state,
        sentences: newSentences,
        activeSentenceIndex: nextIndex,
        typedBuffer: '',
        stats: newStats,
      };
    }

    case 'REVEAL_SENTENCE': {
      if (state.activeSentenceIndex >= state.sentences.length) return state;
      const currentSentence = state.sentences[state.activeSentenceIndex];
      return {
        ...state,
        typedBuffer: currentSentence.text,
      };
    }

    case 'TYPE_CHAR': {
      if (state.isPaused || state.isCompleted || state.activeIndex >= state.tokens.length) {
        return state;
      }

      const currentToken = state.tokens[state.activeIndex];
      const newBuffer = state.typedBuffer + action.payload;
      const newStats = { ...state.stats };
      
      if (!state.isStarted) {
        newStats.startTime = Date.now();
      }
      newStats.totalKeystrokes++;

      const targetWord = currentToken.original;
      const normalizedBuffer = normalizeForComparison(newBuffer, state.settings.mode);
      const normalizedTarget = normalizeForComparison(targetWord, state.settings.mode);

      if (normalizedBuffer === normalizedTarget) {
        const newTokens = [...state.tokens];
        newTokens[state.activeIndex] = { ...currentToken, status: 'correct' };
        newStats.correctCount++;
        
        const nextIndex = getNextActiveIndex(newTokens, state.activeIndex, state.settings.showPunctuation);
        
        if (nextIndex >= newTokens.length) {
          newStats.endTime = Date.now();
          return {
            ...state,
            tokens: newTokens,
            activeIndex: nextIndex,
            typedBuffer: '',
            stats: newStats,
            isStarted: true,
            isCompleted: true,
          };
        }
        
        newTokens[nextIndex] = { ...newTokens[nextIndex], status: 'active' };
        
        return {
          ...state,
          tokens: newTokens,
          activeIndex: nextIndex,
          typedBuffer: '',
          stats: newStats,
          isStarted: true,
        };
      }

      const isPartialMatch = normalizedTarget.startsWith(normalizedBuffer);
      
      if (isPartialMatch) {
        return {
          ...state,
          typedBuffer: newBuffer,
          stats: newStats,
          isStarted: true,
        };
      } else {
        const newTokens = [...state.tokens];
        newTokens[state.activeIndex] = { ...currentToken, status: 'incorrect' };
        newStats.errorCount++;
        
        return {
          ...state,
          tokens: newTokens,
          typedBuffer: newBuffer,
          stats: newStats,
          isStarted: true,
        };
      }
    }

    case 'BACKSPACE': {
      if (state.typedBuffer.length === 0) return state;
      
      const newBuffer = state.typedBuffer.slice(0, -1);
      
      if (state.settings.inputMode === 'sentence') {
        return { ...state, typedBuffer: newBuffer };
      }
      
      const currentToken = state.tokens[state.activeIndex];
      if (!currentToken) return state;
      
      const targetWord = currentToken.original;
      const normalizedBuffer = normalizeForComparison(newBuffer, state.settings.mode);
      const normalizedTarget = normalizeForComparison(targetWord, state.settings.mode);
      const isPartialMatch = newBuffer === '' || normalizedTarget.startsWith(normalizedBuffer);
      
      const newTokens = [...state.tokens];
      newTokens[state.activeIndex] = { 
        ...currentToken, 
        status: isPartialMatch ? 'active' : 'incorrect' 
      };
      
      return {
        ...state,
        tokens: newTokens,
        typedBuffer: newBuffer,
      };
    }

    case 'SKIP_TOKEN': {
      if (state.isPaused || state.isCompleted || state.activeIndex >= state.tokens.length) {
        return state;
      }

      const newTokens = [...state.tokens];
      const newStats = { ...state.stats };
      
      newTokens[state.activeIndex] = { ...newTokens[state.activeIndex], status: 'skipped' };
      newStats.skippedCount++;
      
      const nextIndex = getNextActiveIndex(newTokens, state.activeIndex, state.settings.showPunctuation);
      
      if (nextIndex >= newTokens.length) {
        newStats.endTime = Date.now();
        return {
          ...state,
          tokens: newTokens,
          activeIndex: nextIndex,
          typedBuffer: '',
          stats: newStats,
          isCompleted: true,
        };
      }
      
      newTokens[nextIndex] = { ...newTokens[nextIndex], status: 'active' };
      
      return {
        ...state,
        tokens: newTokens,
        activeIndex: nextIndex,
        typedBuffer: '',
        stats: newStats,
      };
    }

    case 'REVEAL_TOKEN': {
      if (state.activeIndex >= state.tokens.length) return state;
      const currentToken = state.tokens[state.activeIndex];
      return {
        ...state,
        typedBuffer: currentToken.original,
      };
    }

    case 'RESET': {
      if (!state.originalText) return state;
      
      const tokens = tokenize(state.originalText);
      const sentences = createSentences(state.originalText);
      
      let activeIndex = 0;
      if (!state.settings.showPunctuation) {
        while (activeIndex < tokens.length && tokens[activeIndex].isPunctuation) {
          tokens[activeIndex].status = 'correct';
          activeIndex++;
        }
      }
      
      if (activeIndex < tokens.length) {
        tokens[activeIndex].status = 'active';
      }
      
      return {
        ...state,
        tokens,
        sentences,
        activeIndex,
        activeSentenceIndex: 0,
        typedBuffer: '',
        stats: DEFAULT_STATS,
        isPaused: false,
        isStarted: false,
        isCompleted: false,
        selectedRange: null,
        isTypingActive: false,
      };
    }

    case 'PAUSE': {
      return { ...state, isPaused: true };
    }

    case 'RESUME': {
      return { ...state, isPaused: false };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    }

    case 'SELECT_RANGE': {
      return { ...state, selectedRange: action.payload };
    }

    case 'CLEAR_SELECTION': {
      return { ...state, selectedRange: null };
    }

    default:
      return state;
  }
}

export function useTrainer() {
  const [state, dispatch] = useReducer(trainerReducer, initialState);

  useEffect(() => {
    const savedSettings = localStorage.getItem('typingTrainerSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: parsed });
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('typingTrainerSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  const loadText = useCallback((text: string) => {
    dispatch({ type: 'LOAD_TEXT', payload: text });
    localStorage.setItem('typingTrainerText', text);
  }, []);

  const setInput = useCallback((value: string) => {
    dispatch({ type: 'SET_INPUT', payload: value });
  }, []);

  const submitSentence = useCallback(() => {
    dispatch({ type: 'SUBMIT_SENTENCE' });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (state.isPaused || state.isCompleted) return;

    if (state.settings.inputMode === 'word') {
      if (e.key === 'Backspace') {
        e.preventDefault();
        dispatch({ type: 'BACKSPACE' });
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        dispatch({ type: 'TYPE_CHAR', payload: e.key });
      }
    }
    if (state.settings.inputMode === 'sentence' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      dispatch({ type: 'SUBMIT_SENTENCE' });
    }
  }, [state.isPaused, state.isCompleted, state.settings.inputMode]);

  const skip = useCallback(() => {
    if (state.settings.inputMode === 'sentence') {
      dispatch({ type: 'SKIP_SENTENCE' });
    } else {
      dispatch({ type: 'SKIP_TOKEN' });
    }
  }, [state.settings.inputMode]);

  const reveal = useCallback(() => {
    if (state.settings.inputMode === 'sentence') {
      dispatch({ type: 'REVEAL_SENTENCE' });
    } else {
      dispatch({ type: 'REVEAL_TOKEN' });
    }
  }, [state.settings.inputMode]);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), []);
  
  const setTypingActive = useCallback((active: boolean) => {
    dispatch({ type: 'SET_TYPING_ACTIVE', payload: active });
  }, []);

  const updateSettings = useCallback((settings: Partial<TrainerSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const selectRange = useCallback((range: { start: number; end: number } | null) => {
    dispatch({ type: 'SELECT_RANGE', payload: range });
  }, []);

  const calculateStats = useCallback(() => {
    const { stats, isStarted } = state;
    
    if (!isStarted || !stats.startTime) {
      return { wpm: 0, accuracy: 100, time: 0 };
    }
    
    const endTime = stats.endTime || Date.now();
    const elapsedMinutes = (endTime - stats.startTime) / 60000;
    const totalAttempts = stats.correctCount + stats.errorCount;
    
    const wpm = elapsedMinutes > 0 ? Math.round(stats.correctCount / elapsedMinutes) : 0;
    const accuracy = totalAttempts > 0 ? Math.round((stats.correctCount / totalAttempts) * 100) : 100;
    const time = Math.round((endTime - stats.startTime) / 1000);
    
    return { wpm, accuracy, time };
  }, [state]);

  const currentSentence = state.sentences[state.activeSentenceIndex] || null;
  const currentToken = state.tokens[state.activeIndex] || null;

  return {
    state,
    loadText,
    setInput,
    submitSentence,
    handleKeyDown,
    skip,
    reveal,
    reset,
    pause,
    resume,
    updateSettings,
    selectRange,
    setTypingActive,
    calculateStats,
    currentSentence,
    currentToken,
  };
}
