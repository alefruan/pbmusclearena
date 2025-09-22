-- Script para corrigir as políticas de DELETE das tabelas ingressos e cursos
-- Execute este script no SQL Editor do Supabase para corrigir o problema dos botões de delete

-- Remover as políticas restritivas existentes
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.ingressos;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.ingressos;

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.cursos;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.cursos;

-- Criar novas políticas que permitem UPDATE e DELETE para todos os usuários
CREATE POLICY "Enable update for all users" ON public.ingressos FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.ingressos FOR DELETE USING (true);

CREATE POLICY "Enable update for all users" ON public.cursos FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.cursos FOR DELETE USING (true);