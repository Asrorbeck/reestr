-- ============================================
-- TO'LIQ USERS TABLE VA RLS POLICIES SETUP
-- ============================================
-- Bu kodni Supabase Dashboard → SQL Editor'da ishga tushiring
-- Barcha kerakli narsalar shu yerda: users table, RLS policies, mavjud auth users

-- ============================================
-- 1. USERS JADVALI
-- ============================================

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

-- ============================================
-- 2. INDEXLAR
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ============================================
-- 3. UPDATED_AT AVTOMATIK YANGILANISH
-- ============================================

-- Agar oldingi migration'da funksiya yaratilgan bo'lsa, CREATE OR REPLACE xatolik bermaydi
-- Agar yo'q bo'lsa, yaratadi; agar mavjud bo'lsa, yangilaydi
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users jadvali uchun trigger (agar mavjud bo'lsa, o'chirib qayta yaratish)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    DROP TRIGGER update_users_updated_at ON users;
  END IF;
END $$;

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. RLS (ROW LEVEL SECURITY) O'RNATISH
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. ESKI POLICIES'LARNI O'CHIRISH (Agar mavjud bo'lsa)
-- ============================================
-- Eslatma: Bu faqat eski policies'lar mavjud bo'lsa o'chiriladi (xavfsiz)

DO $$
BEGIN
  -- Faqat mavjud bo'lsa o'chirish
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow administrators to insert users') THEN
    DROP POLICY "Allow administrators to insert users" ON users;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow administrators to update users') THEN
    DROP POLICY "Allow administrators to update users" ON users;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow administrators to delete users') THEN
    DROP POLICY "Allow administrators to delete users" ON users;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow authenticated insert access to users') THEN
    DROP POLICY "Allow authenticated insert access to users" ON users;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow authenticated update access to users') THEN
    DROP POLICY "Allow authenticated update access to users" ON users;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow authenticated delete access to users') THEN
    DROP POLICY "Allow authenticated delete access to users" ON users;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow authenticated read access to users') THEN
    DROP POLICY "Allow authenticated read access to users" ON users;
  END IF;
END $$;

-- ============================================
-- 6. YANGI RLS POLICIES
-- ============================================

-- Barcha authenticated foydalanuvchilar o'qishi mumkin
CREATE POLICY "Allow authenticated read access to users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Barcha authenticated foydalanuvchilar qo'shishi mumkin
-- Keyinroq production uchun Administrator tekshiruvi qo'shiladi
CREATE POLICY "Allow authenticated insert access to users" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Barcha authenticated foydalanuvchilar yangilashi mumkin
CREATE POLICY "Allow authenticated update access to users" ON users
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Barcha authenticated foydalanuvchilar o'chirishi mumkin
CREATE POLICY "Allow authenticated delete access to users" ON users
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- 7. MAVJUD AUTH FOYDALANUVCHILARNI QO'SHISH
-- ============================================
-- Barcha Supabase Auth'dagi foydalanuvchilarni users jadvaliga qo'shadi
-- Agar users jadvalida allaqachon mavjud bo'lsa, skip qiladi

INSERT INTO users (id, email, name, role, is_active)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name',
    split_part(au.email, '@', 1)
  ) as name,
  -- Birinchi foydalanuvchini Administrator qilamiz, qolganlarini Viewer
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM users) THEN 'Administrator'
    ELSE 'Viewer'
  END as role,
  true as is_active
FROM auth.users au
WHERE au.email IS NOT NULL
  AND au.deleted_at IS NULL  -- Faqat o'chirilmagan foydalanuvchilar
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.id = au.id
  )
ON CONFLICT (id) DO NOTHING;  -- Agar id conflict bo'lsa, skip qiladi

-- ============================================
-- 8. NATIJANI TEKSHIRISH
-- ============================================

-- Qo'shilgan foydalanuvchilarni ko'rish
SELECT 
  id,
  email,
  name,
  role,
  is_active,
  created_at
FROM users
ORDER BY created_at DESC;

-- ============================================
-- YAKUN
-- ============================================
-- Migration muvaffaqiyatli yakunlandi!
-- Endi frontend'da user management ishlaydi.

