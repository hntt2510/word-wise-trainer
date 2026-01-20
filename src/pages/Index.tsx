import { useEffect, useRef, useState } from 'react';
import { useTrainer } from '@/hooks/useTrainer';
import { TextInputPanel } from '@/components/trainer/TextInputPanel';
import { ComparisonView } from '@/components/trainer/ComparisonView';
import { SentenceInput } from '@/components/trainer/SentenceInput';
import { TypingBox } from '@/components/trainer/TypingBox';
import { StatsBar } from '@/components/trainer/StatsBar';
import { ControlBar } from '@/components/trainer/ControlBar';
import { SettingsBar } from '@/components/trainer/SettingsBar';
import { KnowledgePanel } from '@/components/trainer/KnowledgePanel';
import { LessonHistory } from '@/components/trainer/LessonHistory';
import { VocabularyNotes } from '@/components/trainer/VocabularyNotes';
import { Keyboard, BookOpen, Save, Sparkles, Type, AlignLeft } from 'lucide-react';
import { saveLesson, completeLessonWithStats } from '@/services/lessonService';
import { correctForIELTS, WordAnalysisResult, isGeminiConfigured } from '@/services/geminiService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const {
    state,
    loadText,
    setInput,
    submitSentence,
    handleKeyDown,
    skip,
    reveal,
    reset,
    pause,
    resume,
    updateSettings,
    setTypingActive,
    calculateStats,
    currentSentence,
    currentToken,
  } = useTrainer();

  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const { wpm, accuracy, time } = calculateStats();
  
  // State cho lesson management
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [lessonRefreshTrigger, setLessonRefreshTrigger] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // State cho AI analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wordsToNote, setWordsToNote] = useState<WordAnalysisResult[]>([]);
  const [ieltsCorrection, setIeltsCorrection] = useState<string | null>(null);

  // Hàm lưu lesson
  const handleSaveLesson = async () => {
    if (!state.originalText.trim()) {
      toast({
        title: "Không có nội dung",
        description: "Hãy nhập đoạn văn trước khi lưu",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Tạo title từ đoạn văn đầu tiên
      const title = state.originalText.slice(0, 50).trim() + (state.originalText.length > 50 ? '...' : '');
      
      const lesson = await saveLesson({
        title,
        original_text: state.originalText,
        is_completed: state.isCompleted,
        stats: state.isCompleted ? {
          wpm,
          accuracy,
          time_seconds: time,
          correct_count: state.stats.correctCount,
          error_count: state.stats.errorCount,
          skipped_count: state.stats.skippedCount,
        } : undefined,
      });

      if (lesson) {
        setCurrentLessonId(lesson.id || null);
        setLessonRefreshTrigger(prev => prev + 1);
        toast({
          title: "Đã lưu!",
          description: "Bài học đã được lưu thành công",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu bài học",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save khi hoàn thành
  useEffect(() => {
    if (state.isCompleted && currentLessonId) {
      completeLessonWithStats(currentLessonId, {
        wpm,
        accuracy,
        time_seconds: time,
        correct_count: state.stats.correctCount,
        error_count: state.stats.errorCount,
        skipped_count: state.stats.skippedCount,
      }).then(() => {
        setLessonRefreshTrigger(prev => prev + 1);
      });
    }
  }, [state.isCompleted]);

  // Handler để load lesson từ history
  const handleLoadFromHistory = (text: string) => {
    loadText(text);
    setCurrentLessonId(null);
    setIeltsCorrection(null);
    setWordsToNote([]);
  };

  // Analyze with Gemini for IELTS correction
  const handleAnalyzeWithAI = async () => {
    if (!state.originalText.trim()) {
      toast({
        title: "Không có nội dung",
        description: "Hãy nhập đoạn văn để phân tích",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await correctForIELTS(state.originalText);
      if (result) {
        setIeltsCorrection(result.correctedText);
        setWordsToNote(result.vocabularyToNote);
        toast({
          title: `Band Score: ${result.overallBandScore}`,
          description: result.generalFeedback?.slice(0, 100) || "Đã phân tích xong!",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể phân tích. Kiểm tra lại Gemini API key.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle input mode
  const toggleInputMode = () => {
    updateSettings({ 
      inputMode: state.settings.inputMode === 'sentence' ? 'word' : 'sentence' 
    });
  };

  // Global keyboard handler - CHỈ cho word mode và KHÔNG chặn các button
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Chỉ xử lý trong word mode
      if (state.settings.inputMode !== 'word') return;
      
      // Only handle if we're in typing mode
      if (state.tokens.length === 0 || state.isPaused || state.isCompleted) return;
      
      // Không capture nếu user đang ở textarea, input, hoặc button
      const target = e.target as HTMLElement;
      if (['TEXTAREA', 'INPUT', 'BUTTON'].includes(target.tagName)) return;
      if (target.closest('button')) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeyDown(e as unknown as React.KeyboardEvent);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleKeyDown(e as unknown as React.KeyboardEvent);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [state.tokens.length, state.isPaused, state.isCompleted, state.settings.inputMode, handleKeyDown]);

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl">
                <Keyboard className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Writing Trainer</h1>
                <p className="text-sm text-muted-foreground">Luyện viết tiếng Anh - IELTS Band 7+</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Mode Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleInputMode}
                className="flex items-center gap-1"
              >
                {state.settings.inputMode === 'sentence' ? (
                  <>
                    <AlignLeft className="w-4 h-4" />
                    Nhập câu
                  </>
                ) : (
                  <>
                    <Type className="w-4 h-4" />
                    Nhập từ
                  </>
                )}
              </Button>
              <SettingsBar settings={state.settings} onUpdateSettings={updateSettings} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trainer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input with Save & Analyze Buttons */}
            <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Nhập đoạn văn
                </h2>
                <div className="flex gap-2">
                  {state.originalText && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAnalyzeWithAI}
                        disabled={isAnalyzing}
                        className="flex items-center gap-1"
                      >
                        <Sparkles className="w-4 h-4" />
                        {isAnalyzing ? 'Đang phân tích...' : 'Sửa IELTS 7+'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSaveLesson}
                        disabled={isSaving}
                        className="flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Đang lưu...' : 'Lưu'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <TextInputPanel onLoadText={(text) => {
                loadText(text);
                setCurrentLessonId(null);
                setIeltsCorrection(null);
              }} />
              
              {/* IELTS Correction Result */}
              {ieltsCorrection && ieltsCorrection !== state.originalText && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200 text-sm">Bản sửa Band 7+:</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{ieltsCorrection}</p>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="mt-2 text-xs"
                    onClick={() => {
                      loadText(ieltsCorrection);
                      setIeltsCorrection(null);
                    }}
                  >
                    Dùng bản này để luyện
                  </Button>
                </div>
              )}
            </section>

            {/* Stats */}
            {state.isStarted && (
              <section className="animate-fade-in">
                <StatsBar stats={state.stats} wpm={wpm} accuracy={accuracy} time={time} />
              </section>
            )}

            {/* Original Text Display */}
            {state.originalText && (
              <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Đoạn văn gốc
                  </h2>
                  <ControlBar
                    isPaused={state.isPaused}
                    isStarted={state.isStarted}
                    isCompleted={state.isCompleted}
                    onReset={reset}
                    onPause={pause}
                    onResume={resume}
                    onSkip={skip}
                    onReveal={reveal}
                  />
                </div>
                
                <div className="bg-accent/30 rounded-xl p-4 border border-border/50">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {state.originalText}
                  </p>
                </div>
              </section>
            )}

            {/* Input Section - Sentence or Word mode */}
            <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-primary" />
                {state.settings.inputMode === 'sentence' ? 'Gõ từng câu' : 'Gõ từng từ'}
              </h2>
              
              {state.settings.inputMode === 'sentence' ? (
                <SentenceInput
                  value={state.typedBuffer}
                  currentSentence={currentSentence}
                  sentences={state.sentences}
                  activeSentenceIndex={state.activeSentenceIndex}
                  isPaused={state.isPaused}
                  isCompleted={state.isCompleted}
                  onInputChange={setInput}
                  onSubmit={submitSentence}
                  onSkip={skip}
                  onReveal={reveal}
                />
              ) : (
                <>
                  <ComparisonView
                    originalText={state.originalText}
                    tokens={state.tokens}
                    activeIndex={state.activeIndex}
                    showPunctuation={state.settings.showPunctuation}
                  />
                  <div className="mt-4">
                    <TypingBox
                      value={state.typedBuffer}
                      currentToken={currentToken}
                      isPaused={state.isPaused}
                      isCompleted={state.isCompleted}
                      onKeyDown={() => {}}
                    />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Gõ từng từ một - tự động chuyển khi đúng. Nếu sai, sửa bằng <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Backspace</kbd>
                  </p>
                </>
              )}
            </section>

            {/* Completion Message */}
            {state.isCompleted && (
              <section className="bg-token-correct/10 border border-token-correct/30 rounded-2xl p-6 text-center animate-fade-in">
                <h2 className="text-2xl font-bold text-token-correct mb-2">🎉 Hoàn thành!</h2>
                <p className="text-muted-foreground mb-4">
                  {state.settings.inputMode === 'sentence' 
                    ? `Đã gõ ${state.sentences.length} câu`
                    : `WPM: ${wpm} | Accuracy: ${accuracy}%`
                  } | Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button onClick={reset} variant="default">
                    Làm lại
                  </Button>
                  <Button onClick={handleSaveLesson} variant="outline" disabled={isSaving}>
                    <Save className="w-4 h-4 mr-1" />
                    {isSaving ? 'Đang lưu...' : 'Lưu kết quả'}
                  </Button>
                  <Button onClick={handleAnalyzeWithAI} variant="outline" disabled={isAnalyzing}>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Phân tích AI
                  </Button>
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Knowledge Panel, Vocabulary & History */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Tabs for Knowledge, Vocabulary, History */}
              <Tabs defaultValue="knowledge" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="knowledge" className="text-xs">Kiến thức</TabsTrigger>
                  <TabsTrigger value="vocabulary" className="text-xs">Từ vựng B1+</TabsTrigger>
                  <TabsTrigger value="history" className="text-xs">Lịch sử</TabsTrigger>
                </TabsList>
                
                <TabsContent value="knowledge" className="mt-4">
                  <section className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                    <KnowledgePanel
                      currentToken={currentToken}
                      tokens={state.tokens}
                      activeIndex={state.activeIndex}
                      selectedRange={state.selectedRange}
                    />
                  </section>
                </TabsContent>
                
                <TabsContent value="vocabulary" className="mt-4">
                  <section className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                    <VocabularyNotes wordsToNote={wordsToNote} />
                  </section>
                </TabsContent>
                
                <TabsContent value="history" className="mt-4">
                  <section className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                    <LessonHistory 
                      onLoadLesson={handleLoadFromHistory}
                      refreshTrigger={lessonRefreshTrigger}
                    />
                  </section>
                </TabsContent>
              </Tabs>

              {/* Gemini API Status */}
              <div className="text-xs text-center text-muted-foreground">
                {isGeminiConfigured() ? (
                  <span className="text-green-600 dark:text-green-400">✓ Gemini AI đã kết nối</span>
                ) : (
                  <span>Thêm VITE_GEMINI_API_KEY vào .env để dùng AI</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Luyện tập mỗi ngày để cải thiện kỹ năng viết tiếng Anh! 📝</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
