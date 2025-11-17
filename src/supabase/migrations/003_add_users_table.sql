-- Users jadvali
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Administrator', 'Operator', 'Viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexlar
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- RLS o'rnatish
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS siyosatlari
-- Barcha authenticated foydalanuvchilar o'qishi mumkin
CREATE POLICY "Allow authenticated read access to users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Vaqtincha: Barcha authenticated foydalanuvchilar qo'shishi mumkin
-- Keyinroq Administrator tekshiruvi qo'shiladi
CREATE POLICY "Allow authenticated insert access to users" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Vaqtincha: Barcha authenticated foydalanuvchilar yangilashi mumkin
-- Keyinroq Administrator tekshiruvi qo'shiladi
CREATE POLICY "Allow authenticated update access to users" ON users
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Vaqtincha: Barcha authenticated foydalanuvchilar o'chirishi mumkin
-- Keyinroq Administrator tekshiruvi qo'shiladi
CREATE POLICY "Allow authenticated delete access to users" ON users
  FOR DELETE USING (auth.role() = 'authenticated');

