import { Token } from '@/types/trainer';
import { lookupWord } from '@/data/mockDictionary';
import { getSentenceForToken } from '@/utils/tokenizer';
import { BookOpen, Volume2, FileText, Lightbulb, Quote, Plus } from 'lucide-react';

interface KnowledgePanelProps {
  currentToken: Token | null;
  tokens: Token[];
  activeIndex: number;
  selectedRange: { start: number; end: number } | null;
}

export function KnowledgePanel({ currentToken, tokens, activeIndex, selectedRange }: KnowledgePanelProps) {
  const entry = currentToken ? lookupWord(currentToken.original) : null;
  const sentence = tokens.length > 0 ? getSentenceForToken(tokens, activeIndex) : '';
  
  // Get selected phrase if range is selected
  const selectedPhrase = selectedRange 
    ? tokens.slice(selectedRange.start, selectedRange.end + 1).map(t => t.original).join(' ')
    : null;

  if (!currentToken) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground p-8">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Load a text to see word information here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Current Word Header */}
      <div className="panel-section">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">{currentToken.original}</h3>
          {entry?.ipa && (
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Volume2 className="w-4 h-4" />
              <span className="font-mono">{entry.ipa}</span>
            </button>
          )}
        </div>
        
        {entry?.pos && (
          <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
            {entry.pos}
          </span>
        )}
      </div>

      {/* Meaning */}
      <div className="panel-section">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-sm">Meaning</h4>
        </div>
        {entry?.meaning ? (
          <p className="text-foreground">{entry.meaning}</p>
        ) : (
          <p className="text-muted-foreground italic text-sm">
            Chưa có dữ liệu nghĩa cho từ này
          </p>
        )}
      </div>

      {/* Example */}
      {entry?.example && (
        <div className="panel-section">
          <div className="flex items-center gap-2 mb-2">
            <Quote className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Example</h4>
          </div>
          <p className="text-foreground italic">"{entry.example}"</p>
        </div>
      )}

      {/* Collocations */}
      {entry?.collocations && entry.collocations.length > 0 && (
        <div className="panel-section">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Collocations</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.collocations.map((col, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-accent text-accent-foreground text-sm rounded-lg"
              >
                {col}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sentence Context */}
      {sentence && (
        <div className="panel-section">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Sentence Context</h4>
          </div>
          <p className="text-foreground leading-relaxed">
            {sentence.split(currentToken.original).map((part, idx, arr) => (
              <span key={idx}>
                {part}
                {idx < arr.length - 1 && (
                  <span className="bg-primary/20 text-primary font-medium px-1 rounded">
                    {currentToken.original}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Notes Section */}
      <div className="panel-section">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Notes</h4>
          </div>
          <button className="text-xs text-primary hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" />
            Add note
          </button>
        </div>
        {entry?.notes ? (
          <p className="text-foreground text-sm">{entry.notes}</p>
        ) : (
          <p className="text-muted-foreground italic text-sm">
            Bạn có thể thêm ghi chú riêng cho từ này
          </p>
        )}
      </div>

      {/* Selected Phrase Analysis */}
      {selectedPhrase && (
        <div className="panel-section border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Selected Phrase</h4>
          </div>
          <p className="text-foreground font-medium mb-2">"{selectedPhrase}"</p>
          <p className="text-muted-foreground text-sm">
            Phân tích cấu trúc sẽ được hiển thị ở đây khi tích hợp API
          </p>
        </div>
      )}
    </div>
  );
}
