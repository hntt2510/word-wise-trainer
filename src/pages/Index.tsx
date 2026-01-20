import { useEffect, useRef } from 'react';
import { useTrainer } from '@/hooks/useTrainer';
import { TextInputPanel } from '@/components/trainer/TextInputPanel';
import { TokenLine } from '@/components/trainer/TokenLine';
import { TypingBox } from '@/components/trainer/TypingBox';
import { StatsBar } from '@/components/trainer/StatsBar';
import { ControlBar } from '@/components/trainer/ControlBar';
import { SettingsBar } from '@/components/trainer/SettingsBar';
import { KnowledgePanel } from '@/components/trainer/KnowledgePanel';
import { Keyboard, BookOpen } from 'lucide-react';

const Index = () => {
  const {
    state,
    loadText,
    handleKeyDown,
    skip,
    reveal,
    reset,
    pause,
    resume,
    updateSettings,
    calculateStats,
  } = useTrainer();

  const containerRef = useRef<HTMLDivElement>(null);
  const { wpm, accuracy, time } = calculateStats();
  const currentToken = state.tokens[state.activeIndex] || null;

  // Global keyboard handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only handle if we're in typing mode
      if (state.tokens.length === 0 || state.isPaused || state.isCompleted) return;
      
      // Don't capture if user is typing in textarea
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;

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
  }, [state.tokens.length, state.isPaused, state.isCompleted, handleKeyDown]);

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
                <p className="text-sm text-muted-foreground">Practice typing with English texts</p>
              </div>
            </div>
            <SettingsBar settings={state.settings} onUpdateSettings={updateSettings} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trainer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input */}
            <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <TextInputPanel onLoadText={loadText} />
            </section>

            {/* Stats */}
            {state.isStarted && (
              <section className="animate-fade-in">
                <StatsBar stats={state.stats} wpm={wpm} accuracy={accuracy} time={time} />
              </section>
            )}

            {/* Token Display */}
            <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Text
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
              
              <TokenLine
                tokens={state.tokens}
                activeIndex={state.activeIndex}
                showPunctuation={state.settings.showPunctuation}
              />
            </section>

            {/* Typing Input */}
            <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-primary" />
                Type Here
              </h2>
              <TypingBox
                value={state.typedBuffer}
                currentToken={currentToken}
                isPaused={state.isPaused}
                isCompleted={state.isCompleted}
                onKeyDown={() => {}} // Handled globally now
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Gõ liên tục - tự động chuyển từ khi đúng. Nếu sai, sửa lại bằng <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Backspace</kbd>
              </p>
            </section>

            {/* Completion Message */}
            {state.isCompleted && (
              <section className="bg-token-correct/10 border border-token-correct/30 rounded-2xl p-6 text-center animate-fade-in">
                <h2 className="text-2xl font-bold text-token-correct mb-2">🎉 Hoàn thành!</h2>
                <p className="text-muted-foreground mb-4">
                  WPM: {wpm} | Accuracy: {accuracy}% | Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                </p>
                <button onClick={reset} className="control-btn-primary">
                  Làm lại
                </button>
              </section>
            )}
          </div>

          {/* Right Column - Knowledge Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <section className="bg-card rounded-2xl border border-border p-6 shadow-sm min-h-[500px]">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Knowledge Panel
                </h2>
                <KnowledgePanel
                  currentToken={currentToken}
                  tokens={state.tokens}
                  activeIndex={state.activeIndex}
                  selectedRange={state.selectedRange}
                />
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Practice makes perfect! Keep typing to improve your English writing skills.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
