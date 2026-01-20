import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { Lesson, LessonStats } from '@/types/lesson';

const LESSONS_TABLE = 'lessons';
const LOCAL_STORAGE_KEY = 'word_wise_lessons';

// Fallback to localStorage if Supabase is not configured
function getLocalLessons(): Lesson[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalLessons(lessons: Lesson[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lessons));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Lưu lesson mới
export async function saveLesson(lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<Lesson | null> {
  const now = new Date().toISOString();
  const supabase = getSupabase();
  
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from(LESSONS_TABLE)
        .insert([{
          ...lesson,
          created_at: now,
          updated_at: now,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving lesson to Supabase:', error);
        // Fallback to localStorage on error
        return saveToLocalStorage(lesson, now);
      }
      return data;
    } catch (err) {
      console.error('Supabase error:', err);
      return saveToLocalStorage(lesson, now);
    }
  } else {
    return saveToLocalStorage(lesson, now);
  }
}

function saveToLocalStorage(lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>, now: string): Lesson {
  const lessons = getLocalLessons();
  const newLesson: Lesson = {
    ...lesson,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  lessons.unshift(newLesson);
  saveLocalLessons(lessons);
  return newLesson;
}

// Lấy tất cả lessons
export async function getAllLessons(): Promise<Lesson[]> {
  const supabase = getSupabase();
  
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from(LESSONS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lessons:', error);
        return getLocalLessons();
      }
      return data || [];
    } catch (err) {
      console.error('Supabase error:', err);
      return getLocalLessons();
    }
  } else {
    return getLocalLessons();
  }
}

// Lấy lesson theo ID
export async function getLessonById(id: string): Promise<Lesson | null> {
  const supabase = getSupabase();
  
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from(LESSONS_TABLE)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching lesson:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Supabase error:', err);
      return null;
    }
  } else {
    const lessons = getLocalLessons();
    return lessons.find(l => l.id === id) || null;
  }
}

// Cập nhật lesson (thêm stats khi hoàn thành)
export async function updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson | null> {
  const now = new Date().toISOString();
  const supabase = getSupabase();
  
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from(LESSONS_TABLE)
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating lesson:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Supabase error:', err);
      return null;
    }
  } else {
    const lessons = getLocalLessons();
    const index = lessons.findIndex(l => l.id === id);
    if (index !== -1) {
      lessons[index] = { ...lessons[index], ...updates, updated_at: now };
      saveLocalLessons(lessons);
      return lessons[index];
    }
    return null;
  }
}

// Xóa lesson
export async function deleteLesson(id: string): Promise<boolean> {
  const supabase = getSupabase();
  
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from(LESSONS_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting lesson:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase error:', err);
      return false;
    }
  } else {
    const lessons = getLocalLessons();
    const filtered = lessons.filter(l => l.id !== id);
    saveLocalLessons(filtered);
    return true;
  }
}

// Cập nhật stats khi hoàn thành lesson
export async function completeLessonWithStats(id: string, stats: LessonStats): Promise<Lesson | null> {
  return updateLesson(id, {
    is_completed: true,
    stats,
  });
}
