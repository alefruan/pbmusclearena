-- Criar tabela para ingressos
CREATE TABLE IF NOT EXISTS public.ingressos (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Adicionar índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_ingressos_cpf ON public.ingressos(cpf);
CREATE INDEX IF NOT EXISTS idx_ingressos_email ON public.ingressos(email);
CREATE INDEX IF NOT EXISTS idx_ingressos_nome ON public.ingressos(nome);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.ingressos ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
-- Permitir SELECT para todos (para consultas públicas se necessário)
CREATE POLICY "Enable read access for all users" ON public.ingressos FOR SELECT USING (true);

-- Permitir INSERT para todos (para permitir cadastro de ingressos)
CREATE POLICY "Enable insert for all users" ON public.ingressos FOR INSERT WITH CHECK (true);

-- Permitir UPDATE e DELETE apenas para usuários autenticados (administradores)
-- Você pode ajustar essas políticas conforme suas necessidades de segurança
CREATE POLICY "Enable update for authenticated users only" ON public.ingressos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.ingressos FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ingressos_updated_at BEFORE UPDATE ON public.ingressos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();