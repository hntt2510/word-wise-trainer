import { Token } from '@/types/trainer';

/**
 * Tokenizes text into words and punctuation marks
 * Each token preserves its original form and has a normalized version
 */
export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // Match words, numbers, or punctuation marks
  const regex = /(\w+(?:'\w+)?)|([^\w\s])|(\s+)/g;
  let match;
  let id = 0;
  let sentenceIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, word, punctuation] = match;
    
    // Skip whitespace-only matches
    if (!word && !punctuation) continue;
    
    const original = word || punctuation;
    const isPunctuation = !word && !!punctuation;
    
    tokens.push({
      id: id++,
      original,
      normalized: original.toLowerCase().replace(/[^\w]/g, ''),
      isPunctuation,
      status: 'pending',
      sentenceIndex,
    });

    // Track sentence boundaries
    if (punctuation && ['.', '!', '?'].includes(punctuation)) {
      sentenceIndex++;
    }
  }

  return tokens;
}

/**
 * Extracts sentences from text
 */
export function extractSentences(text: string): string[] {
  // Split by sentence-ending punctuation while keeping the punctuation
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.filter(s => s.trim().length > 0);
}

/**
 * Compares typed input with target token based on mode
 */
export function compareToken(
  typed: string,
  target: Token,
  mode: 'strict' | 'loose'
): boolean {
  const normalizedTyped = typed.trim().toLowerCase();
  
  if (mode === 'strict') {
    return typed.trim() === target.original;
  } else {
    // Loose mode: ignore case and punctuation
    const normalizedTarget = target.normalized;
    return normalizedTyped.replace(/[^\w]/g, '') === normalizedTarget;
  }
}

/**
 * Gets the sentence containing a specific token
 */
export function getSentenceForToken(tokens: Token[], tokenIndex: number): string {
  if (tokenIndex < 0 || tokenIndex >= tokens.length) return '';
  
  const targetSentenceIndex = tokens[tokenIndex].sentenceIndex;
  const sentenceTokens = tokens.filter(t => t.sentenceIndex === targetSentenceIndex);
  
  return sentenceTokens.map(t => t.original).join(' ').replace(/ ([.,!?;:])/g, '$1');
}
