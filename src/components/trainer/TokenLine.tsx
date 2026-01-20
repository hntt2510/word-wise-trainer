import { Token as TokenType } from '@/types/trainer';
import { Token } from './Token';

interface TokenLineProps {
  tokens: TokenType[];
  activeIndex: number;
  showPunctuation: boolean;
  onTokenClick?: (index: number) => void;
}

export function TokenLine({ tokens, activeIndex, showPunctuation, onTokenClick }: TokenLineProps) {
  const visibleTokens = showPunctuation 
    ? tokens 
    : tokens.map((t, i) => ({ ...t, visible: !t.isPunctuation || t.status === 'correct', originalIndex: i }));

  return (
    <div className="token-container flex flex-wrap gap-x-2 gap-y-3 leading-relaxed p-4 bg-card rounded-xl border border-border min-h-[200px] max-h-[400px] overflow-y-auto">
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
          Paste your text above and click "Load into Trainer" to start...
        </div>
      )}
    </div>
  );
}
