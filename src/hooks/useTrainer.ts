import { useReducer, useCallback, useEffect } from 'react';
import { TrainerState, TrainerAction, Token, TrainerSettings, TrainerStats } from '@/types/trainer';
import { tokenize, extractSentences, compareToken } from '@/utils/tokenizer';

const DEFAULT_SETTINGS: TrainerSettings = {
  mode: 'loose',
  showPunctuation: true,
  autoAdvance: true,
  soundEnabled: false,
  allowRewind: false,
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
  activeIndex: 0,
  typedBuffer: '',
  settings: DEFAULT_SETTINGS,
  stats: DEFAULT_STATS,
  isPaused: false,
  isStarted: false,
  isCompleted: false,
  selectedRange: null,
  sentences: [],
};

function getNextActiveIndex(tokens: Token[], currentIndex: number, showPunctuation: boolean): number {
  let nextIndex = currentIndex + 1;
  while (nextIndex < tokens.length) {
    if (showPunctuation || !tokens[nextIndex].isPunctuation) {
      return nextIndex;
    }
    // Auto-mark punctuation as correct if not shown
    tokens[nextIndex].status = 'correct';
    nextIndex++;
  }
  return nextIndex;
}

function trainerReducer(state: TrainerState, action: TrainerAction): TrainerState {
  switch (action.type) {
    case 'LOAD_TEXT': {
      const tokens = tokenize(action.payload);
      const sentences = extractSentences(action.payload);
      
      // Find first non-punctuation token if not showing punctuation
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
        typedBuffer: '',
        stats: DEFAULT_STATS,
        isPaused: false,
        isStarted: false,
        isCompleted: false,
        selectedRange: null,
      };
    }

    case 'TYPE_CHAR': {
      if (state.isPaused || state.isCompleted) return state;
      
      const newStats = { ...state.stats };
      if (!state.isStarted) {
        newStats.startTime = Date.now();
      }
      newStats.totalKeystrokes++;
      
      return {
        ...state,
        typedBuffer: state.typedBuffer + action.payload,
        stats: newStats,
        isStarted: true,
      };
    }

    case 'SUBMIT_TOKEN': {
      if (state.isPaused || state.isCompleted || state.activeIndex >= state.tokens.length) {
        return state;
      }

      const currentToken = state.tokens[state.activeIndex];
      const isCorrect = compareToken(state.typedBuffer, currentToken, state.settings.mode);
      const newTokens = [...state.tokens];
      const newStats = { ...state.stats };

      if (isCorrect) {
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
      } else {
        newTokens[state.activeIndex] = { ...currentToken, status: 'incorrect' };
        newStats.errorCount++;
        
        return {
          ...state,
          tokens: newTokens,
          typedBuffer: '',
          stats: newStats,
        };
      }
    }

    case 'BACKSPACE': {
      if (state.typedBuffer.length === 0) return state;
      return {
        ...state,
        typedBuffer: state.typedBuffer.slice(0, -1),
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
        activeIndex,
        typedBuffer: '',
        stats: DEFAULT_STATS,
        isPaused: false,
        isStarted: false,
        isCompleted: false,
        selectedRange: null,
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
      return {
        ...state,
        selectedRange: action.payload,
      };
    }

    case 'CLEAR_SELECTION': {
      return {
        ...state,
        selectedRange: null,
      };
    }

    default:
      return state;
  }
}

export function useTrainer() {
  const [state, dispatch] = useReducer(trainerReducer, initialState);

  // Load saved settings from localStorage
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

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('typingTrainerSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  const loadText = useCallback((text: string) => {
    dispatch({ type: 'LOAD_TEXT', payload: text });
    localStorage.setItem('typingTrainerText', text);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (state.isPaused || state.isCompleted) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      dispatch({ type: 'BACKSPACE' });
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      dispatch({ type: 'SUBMIT_TOKEN' });
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      dispatch({ type: 'TYPE_CHAR', payload: e.key });
    }
  }, [state.isPaused, state.isCompleted]);

  const skip = useCallback(() => dispatch({ type: 'SKIP_TOKEN' }), []);
  const reveal = useCallback(() => dispatch({ type: 'REVEAL_TOKEN' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), []);
  const updateSettings = useCallback((settings: Partial<TrainerSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);
  const selectRange = useCallback((range: { start: number; end: number } | null) => {
    dispatch({ type: 'SELECT_RANGE', payload: range });
  }, []);

  // Calculate WPM and accuracy
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

  return {
    state,
    loadText,
    handleKeyDown,
    skip,
    reveal,
    reset,
    pause,
    resume,
    updateSettings,
    selectRange,
    calculateStats,
  };
}
