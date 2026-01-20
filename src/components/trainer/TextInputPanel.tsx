import { useState } from 'react';
import { FileText, Upload } from 'lucide-react';

interface TextInputPanelProps {
  onLoadText: (text: string) => void;
}

const SAMPLE_TEXT = `Learning English requires consistent practice and dedication. The key to improving your writing skills is to read extensively and write regularly. By practicing typing, you can increase both your speed and accuracy. Remember that making mistakes is a natural part of the learning process.`;

export function TextInputPanel({ onLoadText }: TextInputPanelProps) {
  const [text, setText] = useState('');

  const handleLoad = () => {
    if (text.trim()) {
      onLoadText(text.trim());
    }
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
    onLoadText(SAMPLE_TEXT);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="w-4 h-4" />
        <span>Paste your writing below to start practicing</span>
      </div>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your English text here..."
        className="w-full h-32 p-4 bg-card border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleLoad}
          disabled={!text.trim()}
          className="control-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          <span>Load into Trainer</span>
        </button>
        
        <button
          onClick={handleLoadSample}
          className="control-btn-ghost"
        >
          <FileText className="w-4 h-4" />
          <span>Load Sample Text</span>
        </button>
      </div>
    </div>
  );
}
