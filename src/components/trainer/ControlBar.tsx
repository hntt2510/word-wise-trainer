import { RotateCcw, Pause, Play, SkipForward, Eye } from 'lucide-react';

interface ControlBarProps {
  isPaused: boolean;
  isStarted: boolean;
  isCompleted: boolean;
  onReset: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onReveal: () => void;
}

export function ControlBar({
  isPaused,
  isStarted,
  isCompleted,
  onReset,
  onPause,
  onResume,
  onSkip,
  onReveal,
}: ControlBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onReset}
        className="control-btn-secondary"
        title="Reset (Làm lại từ đầu)"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset</span>
      </button>
      
      {isStarted && !isCompleted && (
        <>
          {isPaused ? (
            <button
              onClick={onResume}
              className="control-btn-primary"
              title="Tiếp tục"
            >
              <Play className="w-4 h-4" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="control-btn-secondary"
              title="Tạm dừng"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}
        </>
      )}
      
      <button
        onClick={onSkip}
        className="control-btn-ghost"
        disabled={isCompleted || isPaused}
        title="Bỏ qua token này"
      >
        <SkipForward className="w-4 h-4" />
        <span>Skip</span>
      </button>
      
      <button
        onClick={onReveal}
        className="control-btn-ghost"
        disabled={isCompleted || isPaused}
        title="Hiện đáp án"
      >
        <Eye className="w-4 h-4" />
        <span>Reveal</span>
      </button>
    </div>
  );
}
