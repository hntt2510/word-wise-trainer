-- SQL để tạo bảng lessons trong Supabase
-- Chạy script này trong SQL Editor của Supabase Dashboard

-- Tạo bảng lessons
CREATE TABLE IF NOT EXISTS lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    original_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT FALSE,
    stats JSONB
);

-- Tạo index cho việc query
CREATE INDEX IF NOT EXISTS idx_lessons_created_at ON lessons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lessons_is_completed ON lessons(is_completed);

-- Enable Row Level Security (RLS)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép anonymous access (cho dev/testing)
-- Trong production, bạn nên thêm authentication
CREATE POLICY "Allow anonymous access" ON lessons
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Hoặc nếu bạn muốn dùng với user authentication:
-- CREATE POLICY "Users can manage their own lessons" ON lessons
--     FOR ALL
--     USING (auth.uid() = user_id)
--     WITH CHECK (auth.uid() = user_id);

-- Comment về stats JSONB structure:
-- {
--   "wpm": number,
--   "accuracy": number,
--   "time_seconds": number,
--   "correct_count": number,
--   "error_count": number,
--   "skipped_count": number
-- }
