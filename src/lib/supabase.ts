import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Kiểm tra xem Supabase đã được cấu hình chưa
export const isSupabaseConfigured = (): boolean => {
  return supabaseUrl !== '' && 
         supabaseAnonKey !== '' && 
         supabaseUrl.startsWith('http');
};

// Lazy initialization để tránh crash khi chưa config
let _supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
};

// Export for backward compatibility (nhưng có thể null)
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
