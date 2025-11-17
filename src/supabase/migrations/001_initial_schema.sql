-- Integrations jadvali
CREATE TABLE IF NOT EXISTS integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  axborot_tizimi_nomi TEXT NOT NULL,
  integratsiya_usuli TEXT NOT NULL,
  malumot_nomi TEXT NOT NULL,
  tashkilot_nomi_va_shakli TEXT NOT NULL,
  asosiy_maqsad TEXT NOT NULL,
  normativ_huquqiy_hujjat TEXT NOT NULL,
  texnologik_yoriknoma_mavjudligi TEXT DEFAULT '',
  malumot_formati TEXT NOT NULL CHECK (malumot_formati IN ('JSON', 'XML', 'CSV', 'SOAP', 'REST API')),
  maqlumot_almashish_sharti TEXT DEFAULT '',
  yangilanish_davriyligi TEXT DEFAULT '',
  malumot_hajmi TEXT DEFAULT '',
  aloqa_kanali TEXT DEFAULT '',
  oxirgi_uzatish_vaqti TEXT DEFAULT '',
  markaziy_bank_aloqa TEXT DEFAULT '',
  hamkor_aloqa TEXT DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('faol', 'testda', 'rejalashtirilgan', 'muammoli')),
  izoh TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration tabs jadvali
CREATE TABLE IF NOT EXISTS integration_tabs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  column_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration files jadvali
CREATE TABLE IF NOT EXISTS integration_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tab_id UUID NOT NULL REFERENCES integration_tabs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexlar qo'shish
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);
CREATE INDEX IF NOT EXISTS idx_integrations_malumot_formati ON integrations(malumot_formati);
CREATE INDEX IF NOT EXISTS idx_integration_tabs_integration_id ON integration_tabs(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_files_tab_id ON integration_files(tab_id);

-- Updated_at avtomatik yangilanish funksiyasi
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggerlar
CREATE TRIGGER update_integrations_updated_at 
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_tabs_updated_at 
  BEFORE UPDATE ON integration_tabs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) o'rnatish
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_files ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (anon key bilan ishlash uchun)
CREATE POLICY "Public read access" ON integrations
  FOR SELECT USING (true);

CREATE POLICY "Public insert access" ON integrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access" ON integrations
  FOR UPDATE USING (true);

CREATE POLICY "Public delete access" ON integrations
  FOR DELETE USING (true);

CREATE POLICY "Public read access" ON integration_tabs
  FOR SELECT USING (true);

CREATE POLICY "Public insert access" ON integration_tabs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access" ON integration_tabs
  FOR UPDATE USING (true);

CREATE POLICY "Public delete access" ON integration_tabs
  FOR DELETE USING (true);

CREATE POLICY "Public read access" ON integration_files
  FOR SELECT USING (true);

CREATE POLICY "Public insert access" ON integration_files
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access" ON integration_files
  FOR UPDATE USING (true);

CREATE POLICY "Public delete access" ON integration_files
  FOR DELETE USING (true);

