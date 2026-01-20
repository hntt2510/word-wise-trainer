import { useState, useEffect } from 'react';
import { Lesson } from '@/types/lesson';
import { getAllLessons, deleteLesson } from '@/services/lessonService';
import { History, Trash2, Clock, Target, BarChart3, RefreshCw, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LessonHistoryProps {
  onLoadLesson: (text: string) => void;
  refreshTrigger?: number; // Để trigger refresh từ bên ngoài
}

export function LessonHistory({ onLoadLesson, refreshTrigger }: LessonHistoryProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLessons = async () => {
    setLoading(true);
    const data = await getAllLessons();
    setLessons(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    const success = await deleteLesson(id);
    if (success) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-5 h-5 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Đang tải...</span>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-8">
        <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">Chưa có bài học nào</p>
        <p className="text-sm text-muted-foreground/70">Các bài học bạn đã lưu sẽ xuất hiện ở đây</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Lịch sử bài học ({lessons.length})</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchLessons} className="text-xs">
          <RefreshCw className="w-3 h-3 mr-1" />
          Làm mới
        </Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-accent/30 rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 transition-colors"
          >
            {/* Header */}
            <div 
              className="p-3 cursor-pointer flex items-start justify-between gap-2"
              onClick={() => setExpandedId(expandedId === lesson.id ? null : lesson.id!)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm truncate">
                    {lesson.title || 'Bài học không có tiêu đề'}
                  </span>
                  {lesson.is_completed && (
                    <span className="px-1.5 py-0.5 bg-green-500/20 text-green-600 text-[10px] rounded-full flex-shrink-0">
                      ✓ Hoàn thành
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {truncateText(lesson.original_text, 80)}
                </p>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                {expandedId === lesson.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === lesson.id && (
              <div className="px-3 pb-3 space-y-3 border-t border-border/50 pt-3">
                {/* Full text preview */}
                <div className="bg-background/50 p-3 rounded-lg max-h-[150px] overflow-y-auto">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {lesson.original_text}
                  </p>
                </div>

                {/* Stats */}
                {lesson.stats && (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-background/50 p-2 rounded-lg">
                      <BarChart3 className="w-4 h-4 mx-auto text-primary mb-1" />
                      <p className="text-lg font-bold text-foreground">{lesson.stats.wpm}</p>
                      <p className="text-[10px] text-muted-foreground">WPM</p>
                    </div>
                    <div className="bg-background/50 p-2 rounded-lg">
                      <Target className="w-4 h-4 mx-auto text-green-500 mb-1" />
                      <p className="text-lg font-bold text-foreground">{lesson.stats.accuracy}%</p>
                      <p className="text-[10px] text-muted-foreground">Accuracy</p>
                    </div>
                    <div className="bg-background/50 p-2 rounded-lg">
                      <Clock className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                      <p className="text-lg font-bold text-foreground">{formatTime(lesson.stats.time_seconds)}</p>
                      <p className="text-[10px] text-muted-foreground">Time</p>
                    </div>
                  </div>
                )}

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>📅 {formatDate(lesson.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onLoadLesson(lesson.original_text)}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Luyện lại
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xóa bài học?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc muốn xóa bài học này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => lesson.id && handleDelete(lesson.id)}>
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
