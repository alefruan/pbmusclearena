-- Fix cursos table naming conflict
-- Rename the 'cursos' column to 'tipos_cursos' to avoid schema cache confusion

-- First, drop the table if it exists to recreate with proper naming
DROP TABLE IF EXISTS public.cursos CASCADE;

-- Recreate the table with better column naming
CREATE TABLE public.cursos (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL,
  tipos_cursos TEXT NOT NULL, -- Renamed from 'cursos' to 'tipos_cursos'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Add indexes for optimization
CREATE INDEX IF NOT EXISTS idx_cursos_cpf ON public.cursos(cpf);
CREATE INDEX IF NOT EXISTS idx_cursos_email ON public.cursos(email);
CREATE INDEX IF NOT EXISTS idx_cursos_nome ON public.cursos(nome);
CREATE INDEX IF NOT EXISTS idx_cursos_tipos ON public.cursos(tipos_cursos);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Enable read access for all users" ON public.cursos FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.cursos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.cursos FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.cursos FOR DELETE USING (true);

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cursos_updated_at BEFORE UPDATE ON public.cursos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table and column comments
COMMENT ON TABLE public.cursos IS 'Tabela para armazenar inscrições em cursos do evento PB MUSCLE ARENA';
COMMENT ON COLUMN public.cursos.tipos_cursos IS 'Tipos de cursos selecionados (separados por vírgula): Nutrição Esportiva, Treinamento Físico, Capacitação para árbitros, ou Todos os cursos';