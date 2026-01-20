import { useRef, useEffect, useState } from 'react';
import { Sentence } from '@/types/trainer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Eye, SkipForward, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { analyzeSentence, SentenceAnalysisResult } from '@/services/geminiService';

interface SentenceInputProps {
  value: string;
  currentSentence: Sentence | null;
  sentences: Sentence[];
  activeSentenceIndex: number;
  isPaused: boolean;
  isCompleted: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onReveal: () => void;
}

export function SentenceInput({
  value,
  currentSentence,
  sentences,
  activeSentenceIndex,
  isPaused,
  isCompleted,
  onInputChange,
  onSubmit,
  onSkip,
  onReveal,
}: SentenceInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [analysis, setAnalysis] = useState<SentenceAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Không auto-focus - để user tự click vào
  const handleFocus = () => {
    // Có thể thêm logic focus ở đây nếu cần
  };

  const handleSubmit = async () => {
    onSubmit();
    // Analyze sau khi submit
    if (currentSentence) {
      setIsAnalyzing(true);
      const result = await analyzeSentence(value);
      setAnalysis(result);
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Reset analysis when sentence changes
  useEffect(() => {
    setAnalysis(null);
  }, [activeSentenceIndex]);

  const getPlaceholder = () => {
    if (isCompleted) return '🎉 Hoàn thành tất cả câu!';
    if (isPaused) return 'Đang tạm dừng...';
    if (!currentSentence) return 'Nhập đoạn văn ở trên để bắt đầu...';
    return 'Gõ lại câu này rồi nhấn Enter để kiểm tra...';
  };

  const totalSentences = sentences.length;
  const completedSentences = sentences.filter(s => s.status === 'correct' || s.status === 'incorrect').length;
  const progress = totalSentences > 0 ? Math.round((completedSentences / totalSentences) * 100) : 0;

  // Show previous sentence results
  const previousSentence = activeSentenceIndex > 0 ? sentences[activeSentenceIndex - 1] : null;

  return (
    <div className="space-y-4">
      {/* Progress */}
      {sentences.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {completedSentences}/{totalSentences} câu
          </span>
        </div>
      )}

      {/* Current Sentence to Type */}
      {currentSentence && !isCompleted && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-primary">Câu #{activeSentenceIndex + 1}</span>
            <span className="text-xs text-muted-foreground">Gõ lại câu dưới đây</span>
          </div>
          <p className="text-lg font-medium text-foreground leading-relaxed">
            {currentSentence.text}
          </p>
        </div>
      )}

      {/* Previous Sentence Result */}
      {previousSentence && previousSentence.status !== 'pending' && (
        <div className={`rounded-xl p-4 border ${
          previousSentence.status === 'correct' 
            ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900' 
            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
        }`}>
          <div className="flex items-start gap-3">
            {previousSentence.status === 'correct' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            )}
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Bạn đã gõ:</p>
                <p className={`text-sm ${
                  previousSentence.status === 'correct' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {previousSentence.userInput}
                </p>
              </div>
              {previousSentence.status === 'incorrect' && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Câu đúng:</p>
                  <p className="text-sm text-foreground font-medium">{previousSentence.text}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={getPlaceholder()}
          className={`min-h-[100px] text-lg resize-none pr-4 ${
            isPaused || isCompleted || !currentSentence ? 'opacity-50' : ''
          }`}
          disabled={isPaused || isCompleted || !currentSentence}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={handleSubmit} 
          disabled={!value.trim() || isPaused || isCompleted || !currentSentence}
          className="flex-1 sm:flex-none"
        >
          <Send className="w-4 h-4 mr-2" />
          Kiểm tra (Enter)
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onReveal}
          disabled={isPaused || isCompleted || !currentSentence}
        >
          <Eye className="w-4 h-4 mr-2" />
          Xem đáp án
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={onSkip}
          disabled={isPaused || isCompleted || !currentSentence}
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Bỏ qua
        </Button>
      </div>

      {/* Analysis from Gemini */}
      {isAnalyzing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 animate-pulse text-primary" />
          Đang phân tích với AI...
        </div>
      )}
      
      {analysis && (
        <div className="bg-accent/30 rounded-xl p-4 space-y-3 border border-border/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Phân tích AI</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
              Band {analysis.bandScore}
            </span>
          </div>
          
          {analysis.corrected !== analysis.original && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sửa thành Band 7+:</p>
              <p className="text-sm text-foreground font-medium">{analysis.corrected}</p>
            </div>
          )}
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Dịch:</p>
            <p className="text-sm text-foreground italic">{analysis.translation}</p>
          </div>
          
          {analysis.grammarNotes && analysis.grammarNotes.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Ngữ pháp:</p>
              <ul className="text-sm text-foreground list-disc list-inside">
                {analysis.grammarNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Completed State */}
      {isCompleted && (
        <div className="text-center py-4">
          <p className="text-lg font-medium text-green-600 dark:text-green-400">
            🎉 Bạn đã hoàn thành tất cả {sentences.length} câu!
          </p>
        </div>
      )}
    </div>
  );
}
