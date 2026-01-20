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
  }, [isPaused, isCompleted, currentToken]);

  // Keep focus on the input
  const handleBlur = () => {
    if (!isPaused && !isCompleted) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const getPlaceholder = () => {
    if (isCompleted) return 'Hoàn thành! 🎉';
    if (isPaused) return 'Đang tạm dừng...';
    if (!currentToken) return 'Nhập bài để bắt đầu...';
    return `Gõ từ tiếp theo...`;
  };

  const isError = currentToken?.status === 'incorrect';

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={getPlaceholder()}
        className={`typing-input ${isError ? 'border-destructive ring-2 ring-destructive/20' : ''}`}
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
        disabled={isPaused || isCompleted || !currentToken}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        readOnly
      />
      {currentToken && !isPaused && !isCompleted && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
          {isError && (
            <span className="text-sm text-destructive font-medium">Sai! Sửa lại</span>
          )}
          <span className="text-sm text-muted-foreground">
            Target: <span className="font-mono font-medium text-foreground">{currentToken.original}</span>
          </span>
        </div>
      )}
    </div>
  );
}
