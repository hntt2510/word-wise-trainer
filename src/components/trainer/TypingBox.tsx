import { useRef, useEffect } from 'react';
import { Token } from '@/types/trainer';

interface TypingBoxProps {
  value: string;
  currentToken: Token | null;
  isPaused: boolean;
  isCompleted: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function TypingBox({ value, currentToken, isPaused, isCompleted, onKeyDown }: TypingBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPaused && !isCompleted) {
      inputRef.current?.focus();
    }
  }, [isPaused, isCompleted]);

  const getPlaceholder = () => {
    if (isCompleted) return 'Hoàn thành! 🎉';
    if (isPaused) return 'Đang tạm dừng...';
    if (!currentToken) return 'Nhập bài để bắt đầu...';
    return `Gõ: "${currentToken.original}"`;
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={getPlaceholder()}
        className="typing-input"
        onKeyDown={onKeyDown}
        disabled={isPaused || isCompleted || !currentToken}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        readOnly
      />
      {currentToken && !isPaused && !isCompleted && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          Target: <span className="font-mono font-medium text-foreground">{currentToken.original}</span>
        </div>
      )}
    </div>
  );
}
