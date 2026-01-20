import { TrainerSettings } from '@/types/trainer';
import { Settings, Eye, EyeOff, Volume2, VolumeX, Zap } from 'lucide-react';

interface SettingsBarProps {
  settings: TrainerSettings;
  onUpdateSettings: (settings: Partial<TrainerSettings>) => void;
}

export function SettingsBar({ settings, onUpdateSettings }: SettingsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Mode:</span>
        <div className="flex rounded-lg overflow-hidden border border-border">
          <button
            onClick={() => onUpdateSettings({ mode: 'strict' })}
            className={settings.mode === 'strict' ? 'toggle-btn-active' : 'toggle-btn-inactive'}
          >
            Strict
          </button>
          <button
            onClick={() => onUpdateSettings({ mode: 'loose' })}
            className={settings.mode === 'loose' ? 'toggle-btn-active' : 'toggle-btn-inactive'}
          >
            Loose
          </button>
        </div>
      </div>
      
      <div className="h-6 w-px bg-border" />
      
      <button
        onClick={() => onUpdateSettings({ showPunctuation: !settings.showPunctuation })}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          settings.showPunctuation 
            ? 'bg-primary/10 text-primary' 
            : 'bg-muted text-muted-foreground'
        }`}
        title={settings.showPunctuation ? 'Ẩn dấu câu' : 'Hiện dấu câu'}
      >
        {settings.showPunctuation ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        <span>Punctuation</span>
      </button>
      
      <button
        onClick={() => onUpdateSettings({ autoAdvance: !settings.autoAdvance })}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          settings.autoAdvance 
            ? 'bg-primary/10 text-primary' 
            : 'bg-muted text-muted-foreground'
        }`}
        title={settings.autoAdvance ? 'Tắt auto-advance' : 'Bật auto-advance'}
      >
        <Zap className="w-4 h-4" />
        <span>Auto</span>
      </button>
      
      <button
        onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          settings.soundEnabled 
            ? 'bg-primary/10 text-primary' 
            : 'bg-muted text-muted-foreground'
        }`}
        title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
      >
        {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        <span>Sound</span>
      </button>
    </div>
  );
}
