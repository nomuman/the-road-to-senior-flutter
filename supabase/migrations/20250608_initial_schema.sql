-- Create modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  module_title TEXT NOT NULL, -- Redundant but useful for quick display
  objective TEXT,
  concepts TEXT[],
  relevance TEXT,
  quiz_data JSONB, -- クイズデータをJSON形式で保存
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, lesson_id) -- ユーザーとレッスンIDの組み合わせは一意
);

-- Enable Row Level Security (RLS) and define policies

-- modules table RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON modules FOR SELECT USING (true);

-- lessons table RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON lessons FOR SELECT USING (true);

-- users table RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow authenticated users to update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow authenticated users to insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- user_progress table RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read their own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert their own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to update their own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);