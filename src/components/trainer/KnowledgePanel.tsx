import { useState } from 'react';
import { Token } from '@/types/trainer';
import { lookupWord } from '@/data/mockDictionary';
import { getSentenceForToken } from '@/utils/tokenizer';
import { getEnhancedWordAnalysis, analyzeGrammarPatterns, posExplanations } from '@/data/grammarData';
import { GrammarPattern } from '@/types/lesson';
import { 
  BookOpen, Volume2, FileText, Lightbulb, Quote, Plus, 
  ChevronDown, ChevronUp, GraduationCap, Languages, Sparkles 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface KnowledgePanelProps {
  currentToken: Token | null;
  tokens: Token[];
  activeIndex: number;
  selectedRange: { start: number; end: number } | null;
}

export function KnowledgePanel({ currentToken, tokens, activeIndex, selectedRange }: KnowledgePanelProps) {
  const [expandedGrammar, setExpandedGrammar] = useState<string | null>(null);
  
  const entry = currentToken ? lookupWord(currentToken.original) : null;
  const sentence = tokens.length > 0 ? getSentenceForToken(tokens, activeIndex) : '';
  
  // Enhanced word analysis with grammar
  const wordAnalysis = currentToken ? getEnhancedWordAnalysis(currentToken.original, sentence) : null;
  
  // Analyze grammar patterns in the current sentence
  const grammarPatterns = sentence ? analyzeGrammarPatterns(sentence) : [];
  
  // Get selected phrase if range is selected
  const selectedPhrase = selectedRange 
    ? tokens.slice(selectedRange.start, selectedRange.end + 1).map(t => t.original).join(' ')
    : null;

  if (!currentToken) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground p-8">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nhập đoạn văn để xem thông tin từ vựng và ngữ pháp</p>
        </div>
      </div>
    );
  }

  const posInfo = wordAnalysis?.pos ? posExplanations[wordAnalysis.pos] : null;

  return (
    <div className="space-y-4 animate-fade-in max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      {/* Current Word Header */}
      <div className="panel-section bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-bold text-foreground">{currentToken.original}</h3>
          {entry?.ipa && (
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors bg-background/50 px-2 py-1 rounded-lg">
              <Volume2 className="w-4 h-4" />
              <span className="font-mono">{entry.ipa}</span>
            </button>
          )}
        </div>
        
        {/* Part of Speech với giải thích */}
        {(entry?.pos || wordAnalysis?.pos) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              {entry?.pos || wordAnalysis?.pos}
            </span>
            {(posInfo || wordAnalysis?.pos_vietnamese) && (
              <span className="text-sm text-muted-foreground">
                ({posInfo?.vietnamese || wordAnalysis?.pos_vietnamese})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meaning - Chi tiết hơn */}
      <div className="panel-section">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-sm">Nghĩa & Vai trò</h4>
        </div>
        {entry?.meaning || wordAnalysis?.meaning ? (
          <div className="space-y-2">
            <p className="text-foreground font-medium">{entry?.meaning || wordAnalysis?.meaning}</p>
            {wordAnalysis?.grammar_role && (
              <p className="text-sm text-muted-foreground bg-accent/30 px-3 py-2 rounded-lg">
                <span className="font-medium text-foreground">Vai trò trong câu:</span> {wordAnalysis.grammar_role}
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground italic text-sm">
            Chưa có dữ liệu nghĩa cho từ này
          </p>
        )}
      </div>

      {/* Sentence Context with Highlight */}
      {sentence && (
        <div className="panel-section">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Ngữ cảnh câu</h4>
          </div>
          <p className="text-foreground leading-relaxed bg-accent/20 p-3 rounded-lg">
            {sentence.split(new RegExp(`(${currentToken.original})`, 'gi')).map((part, idx) => (
              <span key={idx}>
                {part.toLowerCase() === currentToken.original.toLowerCase() ? (
                  <span className="bg-primary/30 text-primary font-bold px-1 rounded">
                    {part}
                  </span>
                ) : (
                  part
                )}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Grammar Patterns - Phần mới quan trọng */}
      {grammarPatterns.length > 0 && (
        <div className="panel-section border-2 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-base">Ngữ pháp trong câu</h4>
          </div>
          
          <Accordion type="single" collapsible className="space-y-2">
            {grammarPatterns.map((pattern, idx) => (
              <AccordionItem key={pattern.id} value={pattern.id} className="border rounded-lg bg-background/50">
                <AccordionTrigger className="px-3 py-2 hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-foreground">{pattern.name}</span>
                    <span className="text-xs text-muted-foreground">{pattern.pattern}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-3">
                    {/* Giải thích */}
                    <div className="bg-accent/30 p-3 rounded-lg">
                      <p className="text-sm text-foreground mb-1">{pattern.explanation}</p>
                      <p className="text-sm font-medium text-primary">{pattern.vietnamese_explanation}</p>
                    </div>
                    
                    {/* Ví dụ */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Ví dụ luyện tập:
                      </p>
                      <div className="space-y-2">
                        {pattern.examples.slice(0, 3).map((ex, exIdx) => (
                          <div key={exIdx} className="bg-background p-2 rounded-lg border border-border/50">
                            <p className="text-sm">
                              {ex.sentence.split(new RegExp(`(${ex.highlight})`, 'gi')).map((part, pIdx) => (
                                <span key={pIdx}>
                                  {part.toLowerCase() === ex.highlight.toLowerCase() ? (
                                    <span className="bg-yellow-200 dark:bg-yellow-900 font-medium px-0.5 rounded">
                                      {part}
                                    </span>
                                  ) : (
                                    part
                                  )}
                                </span>
                              ))}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">→ {ex.translation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Related patterns */}
                    {pattern.related_patterns && pattern.related_patterns.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Cấu trúc liên quan:</p>
                        <div className="flex flex-wrap gap-1">
                          {pattern.related_patterns.map((rel, relIdx) => (
                            <span key={relIdx} className="text-xs bg-muted px-2 py-0.5 rounded">
                              {rel.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Example */}
      {entry?.example && (
        <div className="panel-section">
          <div className="flex items-center gap-2 mb-2">
            <Quote className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Ví dụ từ điển</h4>
          </div>
          <p className="text-foreground italic bg-accent/20 p-3 rounded-lg">"{entry.example}"</p>
        </div>
      )}

      {/* Collocations */}
      {entry?.collocations && entry.collocations.length > 0 && (
        <div className="panel-section">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Cụm từ thường gặp</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.collocations.map((col, idx) => (
              <span 
                key={idx}
                className="px-3 py-1.5 bg-accent text-accent-foreground text-sm rounded-lg border border-border/50 hover:bg-accent/80 transition-colors cursor-pointer"
              >
                {col}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Part of Speech Detail */}
      {posInfo && (
        <div className="panel-section bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Về loại từ: {posInfo.name}</h4>
          </div>
          <p className="text-sm text-foreground mb-2">{posInfo.explanation}</p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-muted-foreground">Ví dụ khác:</span>
            {posInfo.examples.map((ex, idx) => (
              <span key={idx} className="text-xs bg-background px-2 py-0.5 rounded border">
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="panel-section">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Ghi chú cá nhân</h4>
          </div>
          <button className="text-xs text-primary hover:underline flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
            <Plus className="w-3 h-3" />
            Thêm ghi chú
          </button>
        </div>
        {entry?.notes ? (
          <p className="text-foreground text-sm bg-accent/20 p-3 rounded-lg">{entry.notes}</p>
        ) : (
          <p className="text-muted-foreground italic text-sm">
            Bạn có thể thêm ghi chú riêng cho từ này để ghi nhớ tốt hơn
          </p>
        )}
      </div>

      {/* Selected Phrase Analysis */}
      {selectedPhrase && (
        <div className="panel-section border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Cụm từ đã chọn</h4>
          </div>
          <p className="text-foreground font-medium mb-2 text-lg">"{selectedPhrase}"</p>
          <p className="text-muted-foreground text-sm">
            Phân tích cấu trúc sẽ được hiển thị ở đây khi tích hợp API
          </p>
        </div>
      )}
    </div>
  );
}
