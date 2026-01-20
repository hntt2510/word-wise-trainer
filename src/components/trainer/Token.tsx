import { useRef, useEffect } from 'react';
import { Token as TokenType } from '@/types/trainer';
import { cn } from '@/lib/utils';

interface TokenProps {
  token: TokenType;
  isActive: boolean;
  onClick?: () => void;
  onSelect?: (tokenId: number) => void;
}

export function Token({ token, isActive, onClick, onSelect }: TokenProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }, [isActive]);

  const getStatusClasses = () => {
    switch (token.status) {
      case 'pending':
        return 'token-pending';
      case 'active':
        return 'token-active';
      case 'correct':
        return 'token-correct';
      case 'incorrect':
        return 'token-incorrect';
      case 'skipped':
        return 'token-skipped';
      default:
        return 'token-pending';
    }
  };

  return (
    <span
      ref={ref}
      className={cn(
        'token-base font-mono text-lg cursor-pointer select-none',
        getStatusClasses(),
        isActive && 'animate-pulse-soft'
      )}
      onClick={onClick}
      onMouseDown={() => onSelect?.(token.id)}
    >
      {token.original}
    </span>
  );
}
