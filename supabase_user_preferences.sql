-- =====================================================
-- GAIA: Tabla consent para Supabase
-- =====================================================
-- Ejecutar este script en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query > Pegar y ejecutar

CREATE TABLE IF NOT EXISTS consent (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_save_enabled BOOLEAN NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: cada usuario solo puede ver y modificar su propio consentimiento
ALTER TABLE consent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own consent"
  ON consent
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
