import { useState, useEffect } from 'react';
import { WordAnalysisResult } from '@/services/geminiService';
import { BookOpen, Star, Trash2, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VocabularyNotesProps {
  wordsToNote: WordAnalysisResult[];
  onRemoveWord?: (word: string) => void;
}

const LOCAL_STORAGE_KEY = 'vocabulary_notes_b1plus';

// Lấy màu theo CEFR level
function getLevelColor(level: string): string {
  switch (level) {
    case 'B1': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'B2': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'C1': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'C2': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
}

export function VocabularyNotes({ wordsToNote, onRemoveWord }: VocabularyNotesProps) {
  const [savedWords, setSavedWords] = useState<WordAnalysisResult[]>([]);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Load saved words from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setSavedWords(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load vocabulary:', e);
    }
  }, []);

  // Auto-save new B1+ words
  useEffect(() => {
    if (wordsToNote.length > 0) {
      const b1PlusWords = wordsToNote.filter(w => 
        ['B1', 'B2', 'C1', 'C2'].includes(w.level)
      );
      
      if (b1PlusWords.length > 0) {
        setSavedWords(prev => {
          const existingWords = new Set(prev.map(w => w.word.toLowerCase()));
          const newWords = b1PlusWords.filter(w => !existingWords.has(w.word.toLowerCase()));
          
          if (newWords.length > 0) {
            const updated = [...newWords, ...prev];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      }
    }
  }, [wordsToNote]);

  const handleRemove = (word: string) => {
    setSavedWords(prev => {
      const updated = prev.filter(w => w.word !== word);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    onRemoveWord?.(word);
  };

  const handleClearAll = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả từ vựng đã lưu?')) {
      setSavedWords([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const displayWords = showAll ? savedWords : savedWords.slice(0, 10);

  if (savedWords.length === 0) {
    return (
      <div className="text-center py-6">
        <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Từ vựng B1+ sẽ tự động được lưu tại đây</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-medium text-sm">Từ vựng B1+ ({savedWords.length})</span>
        </div>
        {savedWords.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs text-muted-foreground">
            <Trash2 className="w-3 h-3 mr-1" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Word List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {displayWords.map((word, idx) => (
          <div 
            key={`${word.word}-${idx}`}
            className="bg-accent/30 rounded-lg border border-border/50 overflow-hidden"
          >
            {/* Word Header */}
            <div 
              className="p-3 cursor-pointer flex items-center justify-between gap-2 hover:bg-accent/50 transition-colors"
              onClick={() => setExpandedWord(expandedWord === word.word ? null : word.word)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-medium text-foreground">{word.word}</span>
                <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-medium ${getLevelColor(word.level)}`}>
                  {word.level}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ({word.posVietnamese})
                </span>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(word.word);
                  }}
                >
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </Button>
                {expandedWord === word.word ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedWord === word.word && (
              <div className="px-3 pb-3 space-y-2 border-t border-border/50 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Nghĩa:</p>
                  <p className="text-sm text-foreground">{word.meaningVietnamese}</p>
                </div>
                
                {word.examples && word.examples.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Ví dụ:</p>
                    <ul className="text-sm text-foreground italic list-disc list-inside">
                      {word.examples.slice(0, 2).map((ex, i) => (
                        <li key={i} className="text-xs">{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {word.collocations && word.collocations.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Cụm từ:</p>
                    <div className="flex flex-wrap gap-1">
                      {word.collocations.slice(0, 4).map((col, i) => (
                        <span key={i} className="text-xs bg-background px-1.5 py-0.5 rounded border">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {word.synonyms && word.synonyms.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Từ đồng nghĩa:</p>
                    <p className="text-xs text-foreground">{word.synonyms.slice(0, 4).join(', ')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show more/less */}
      {savedWords.length > 10 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Thu gọn' : `Xem thêm ${savedWords.length - 10} từ`}
        </Button>
      )}
    </div>
  );
}
