-- Sequential number qo'shish integrations jadvaliga
ALTER TABLE integrations ADD COLUMN IF NOT EXISTS sequential_number INTEGER;

-- Sequential number uchun unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_integrations_sequential_number ON integrations(sequential_number);

-- Sequential number avtomatik berilishi uchun funksiya
CREATE OR REPLACE FUNCTION generate_sequential_number()
RETURNS INTEGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(sequential_number), 0) + 1 INTO next_number
  FROM integrations;
  RETURN next_number;
END;
$$ LANGUAGE plpgsql;

-- Integrations jadvaliga sequential_number avtomatik berilishi uchun trigger
CREATE OR REPLACE FUNCTION set_sequential_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sequential_number IS NULL THEN
    NEW.sequential_number := generate_sequential_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_integrations_sequential_number
  BEFORE INSERT ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION set_sequential_number();

-- Audit logs jadvali
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted'
  integration_id UUID REFERENCES integrations(id) ON DELETE SET NULL,
  integration_name TEXT,
  changes JSONB, -- O'zgartirilgan maydonlar va ularning eski/yangi qiymatlari
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexlar
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_email ON audit_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_integration_id ON audit_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- RLS o'rnatish
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public policies
CREATE POLICY "Public read access" ON audit_logs
  FOR SELECT USING (true);

CREATE POLICY "Public insert access" ON audit_logs
  FOR INSERT WITH CHECK (true);

