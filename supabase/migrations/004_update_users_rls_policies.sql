-- Users jadvali uchun to'g'ri RLS policies
-- Bu migration'ni faqat migration 003'dan keyin ishga tushiring

-- Avval eski policies'larni o'chirish
DROP POLICY IF EXISTS "Allow authenticated read access to users" ON users;
DROP POLICY IF EXISTS "Allow authenticated insert access to users" ON users;
DROP POLICY IF EXISTS "Allow authenticated update access to users" ON users;
DROP POLICY IF EXISTS "Allow authenticated delete access to users" ON users;

-- Yangi policies - Administrator tekshiruvi bilan

-- Barcha authenticated foydalanuvchilar o'qishi mumkin
CREATE POLICY "Allow authenticated read access to users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Faqat Administrator rolidagi foydalanuvchilar qo'shishi mumkin
-- Circular dependency'ni oldini olish uchun function ishlatamiz
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'Administrator'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Allow administrators to insert users" ON users
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Allow administrators to update users" ON users
  FOR UPDATE USING (is_admin());

CREATE POLICY "Allow administrators to delete users" ON users
  FOR DELETE USING (is_admin());

