import { Token as TokenType } from '@/types/trainer';
import { Token } from './Token';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface ComparisonViewProps {
  originalText: string;
  tokens: TokenType[];
  activeIndex: number;
  showPunctuation: boolean;
  onTokenClick?: (index: number) => void;
}

export function ComparisonView({ 
  originalText, 
  tokens, 
  activeIndex, 
  showPunctuation,
  onTokenClick 
}: ComparisonViewProps) {
  const [showOriginal, setShowOriginal] = useState(true);

  // Tính toán tiến độ
  const completedTokens = tokens.filter(t => t.status === 'correct' || t.status === 'skipped').length;
  const totalWords = tokens.filter(t => !t.isPunctuation).length;
  const progress = totalWords > 0 ? Math.round((completedTokens / tokens.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Original Text Section - Luôn hiển thị */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            📖 Đoạn văn gốc
          </h3>
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            {showOriginal ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Ẩn
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Hiện
              </>
            )}
          </button>
        </div>
        
        {showOriginal && (
          <div className="bg-accent/30 rounded-xl p-4 border border-border/50">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
              {originalText || <span className="text-muted-foreground italic">Chưa có nội dung...</span>}
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {tokens.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium min-w-[45px] text-right">
            {progress}%
          </span>
        </div>
      )}

      {/* Typing Progress Section */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          ⌨️ Tiến độ gõ
        </h3>
        <div className="token-container flex flex-wrap gap-x-2 gap-y-3 leading-relaxed p-4 bg-card rounded-xl border border-border min-h-[150px] max-h-[350px] overflow-y-auto">
          {tokens.map((token, index) => {
            if (!showPunctuation && token.isPunctuation && token.status !== 'correct') {
              return null;
            }
            
            return (
              <Token
                key={token.id}
                token={token}
                isActive={index === activeIndex}
                onClick={() => onTokenClick?.(index)}
              />
            );
          })}
          {tokens.length === 0 && (
            <div className="text-muted-foreground italic">
              Nhập bài ở trên và nhấn "Load into Trainer" để bắt đầu...
            </div>
          )}
        </div>
      </div>

      {/* Current Word Highlight */}
      {tokens[activeIndex] && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Từ cần gõ:</span>
            <p className="text-2xl font-bold text-primary">{tokens[activeIndex].original}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Vị trí:</span>
            <p className="text-lg font-medium">{activeIndex + 1} / {tokens.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
