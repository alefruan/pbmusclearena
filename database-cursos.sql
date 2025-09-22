-- Criar tabela para cursos
CREATE TABLE IF NOT EXISTS public.cursos (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL,
  curso TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Adicionar índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_cursos_cpf ON public.cursos(cpf);
CREATE INDEX IF NOT EXISTS idx_cursos_email ON public.cursos(email);
CREATE INDEX IF NOT EXISTS idx_cursos_nome ON public.cursos(nome);
CREATE INDEX IF NOT EXISTS idx_cursos_curso ON public.cursos(curso);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
-- Permitir SELECT para todos (para consultas públicas se necessário)
CREATE POLICY "Enable read access for all users" ON public.cursos FOR SELECT USING (true);

-- Permitir INSERT para todos (para permitir cadastro de cursos)
CREATE POLICY "Enable insert for all users" ON public.cursos FOR INSERT WITH CHECK (true);

-- Permitir UPDATE e DELETE apenas para usuários autenticados (administradores)
-- Você pode ajustar essas políticas conforme suas necessidades de segurança
CREATE POLICY "Enable update for authenticated users only" ON public.cursos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.cursos FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger para atualizar o campo updated_at automaticamente
-- Usar a função existente ou criar se não existir
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cursos_updated_at BEFORE UPDATE ON public.cursos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE public.cursos IS 'Tabela para armazenar inscrições em cursos do evento PB MUSCLE ARENA';
COMMENT ON COLUMN public.cursos.curso IS 'Tipo de curso: Nutrição Esportiva, Treinamento Físico, Capacitação para árbitros, ou Todos os cursos';