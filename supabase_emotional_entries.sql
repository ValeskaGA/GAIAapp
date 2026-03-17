-- ===========================================
-- GAIA: Tabla emotional_entries para Supabase
-- ===========================================
-- Ejecutar este script en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query > Pegar y ejecutar

CREATE TABLE emotional_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  created_at TIMESTAMPTZ DEFAULT now(),
  emotion TEXT NOT NULL,
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
  context TEXT,
  cause TEXT,
  summary TEXT,
  source TEXT NOT NULL DEFAULT 'chat' CHECK (source IN ('chat', 'manual'))
);

-- Índice para consultas por usuario
CREATE INDEX idx_emotional_entries_user_id ON emotional_entries(user_id);

-- Índice para consultas por fecha (más recientes primero)
CREATE INDEX idx_emotional_entries_created_at ON emotional_entries(created_at DESC);
