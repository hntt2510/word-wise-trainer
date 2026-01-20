import { TrainerStats } from '@/types/trainer';
import { Gauge, Target, XCircle, Clock, Keyboard } from 'lucide-react';

interface StatsBarProps {
  stats: TrainerStats;
  wpm: number;
  accuracy: number;
  time: number;
}

export function StatsBar({ stats, wpm, accuracy, time }: StatsBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div className="stat-card flex items-center gap-3">
        <div className="p-2 rounded-lg bg-stat-wpm/10">
          <Gauge className="w-5 h-5 text-stat-wpm" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">WPM</p>
          <p className="text-2xl font-bold text-stat-wpm">{wpm}</p>
        </div>
      </div>
      
      <div className="stat-card flex items-center gap-3">
        <div className="p-2 rounded-lg bg-stat-accuracy/10">
          <Target className="w-5 h-5 text-stat-accuracy" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Accuracy</p>
          <p className="text-2xl font-bold text-stat-accuracy">{accuracy}%</p>
        </div>
      </div>
      
      <div className="stat-card flex items-center gap-3">
        <div className="p-2 rounded-lg bg-token-correct/10">
          <Keyboard className="w-5 h-5 text-token-correct" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Correct</p>
          <p className="text-2xl font-bold text-token-correct">{stats.correctCount}</p>
        </div>
      </div>
      
      <div className="stat-card flex items-center gap-3">
        <div className="p-2 rounded-lg bg-stat-errors/10">
          <XCircle className="w-5 h-5 text-stat-errors" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Errors</p>
          <p className="text-2xl font-bold text-stat-errors">{stats.errorCount}</p>
        </div>
      </div>
      
      <div className="stat-card flex items-center gap-3">
        <div className="p-2 rounded-lg bg-stat-time/10">
          <Clock className="w-5 h-5 text-stat-time" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Time</p>
          <p className="text-2xl font-bold text-stat-time">{formatTime(time)}</p>
        </div>
      </div>
    </div>
  );
}
