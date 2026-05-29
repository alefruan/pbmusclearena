-- ============================================================
-- EXECUTAR NO SUPABASE: Dashboard → SQL Editor → New query
-- Restringe leitura dos dados apenas para usuários autenticados
-- ============================================================

-- ========================================
-- REGISTRATIONS: leitura só para admin
-- ========================================
DROP POLICY IF EXISTS "Enable read access for all users" ON registrations;
DROP POLICY IF EXISTS "Enable insert access for all users" ON registrations;
DROP POLICY IF EXISTS "Enable update access for all users" ON registrations;
DROP POLICY IF EXISTS "Enable delete access for all users" ON registrations;
DROP POLICY IF EXISTS "Admin can select registrations" ON registrations;
DROP POLICY IF EXISTS "Anyone can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Admin can update registrations" ON registrations;
DROP POLICY IF EXISTS "Admin can delete registrations" ON registrations;

CREATE POLICY "Admin can select registrations"
  ON registrations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can insert registrations"
  ON registrations FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admin can update registrations"
  ON registrations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete registrations"
  ON registrations FOR DELETE TO authenticated USING (true);

-- ========================================
-- INGRESSOS: leitura só para admin
-- ========================================
DROP POLICY IF EXISTS "Enable read access for all users" ON ingressos;
DROP POLICY IF EXISTS "Enable insert access for all users" ON ingressos;
DROP POLICY IF EXISTS "Enable update access for all users" ON ingressos;
DROP POLICY IF EXISTS "Enable delete access for all users" ON ingressos;
DROP POLICY IF EXISTS "Admin can select ingressos" ON ingressos;
DROP POLICY IF EXISTS "Anyone can insert ingressos" ON ingressos;
DROP POLICY IF EXISTS "Admin can update ingressos" ON ingressos;
DROP POLICY IF EXISTS "Admin can delete ingressos" ON ingressos;

CREATE POLICY "Admin can select ingressos"
  ON ingressos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can insert ingressos"
  ON ingressos FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admin can update ingressos"
  ON ingressos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete ingressos"
  ON ingressos FOR DELETE TO authenticated USING (true);

-- ========================================
-- CURSOS: leitura só para admin
-- ========================================
DROP POLICY IF EXISTS "Enable read access for all users" ON cursos;
DROP POLICY IF EXISTS "Enable insert access for all users" ON cursos;
DROP POLICY IF EXISTS "Enable update access for all users" ON cursos;
DROP POLICY IF EXISTS "Enable delete access for all users" ON cursos;
DROP POLICY IF EXISTS "Admin can select cursos" ON cursos;
DROP POLICY IF EXISTS "Anyone can insert cursos" ON cursos;
DROP POLICY IF EXISTS "Admin can update cursos" ON cursos;
DROP POLICY IF EXISTS "Admin can delete cursos" ON cursos;

CREATE POLICY "Admin can select cursos"
  ON cursos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can insert cursos"
  ON cursos FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admin can update cursos"
  ON cursos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete cursos"
  ON cursos FOR DELETE TO authenticated USING (true);

-- ========================================
-- SETTINGS: leitura pública (necessário para status dos formulários)
--           escrita só para admin
-- ========================================
DROP POLICY IF EXISTS "Enable read access for all users" ON settings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON settings;
DROP POLICY IF EXISTS "Enable update access for all users" ON settings;
DROP POLICY IF EXISTS "Enable delete access for all users" ON settings;
DROP POLICY IF EXISTS "Anyone can read settings" ON settings;
DROP POLICY IF EXISTS "Admin can manage settings" ON settings;

CREATE POLICY "Anyone can read settings"
  ON settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin can manage settings"
  ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========================================
-- FUNÇÃO RPC: verificação segura de inscrição por CPF
-- Anônimos só podem buscar o próprio registro informando o CPF exato
-- Não expõe a lista geral de inscritos
-- ========================================
DROP FUNCTION IF EXISTS verify_registration(TEXT, TEXT);
DROP FUNCTION IF EXISTS verify_registration(TEXT);

CREATE FUNCTION verify_registration(p_cpf TEXT)
RETURNS SETOF registrations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM registrations
  WHERE cpf = p_cpf;
END;
$$;

-- ========================================
-- FUNÇÃO RPC: inserir ingresso e retornar ID
-- Permite anônimos inserirem e obterem o ID sem SELECT direto na tabela
-- ========================================
DROP FUNCTION IF EXISTS insert_ingresso(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

CREATE FUNCTION insert_ingresso(
  p_nome TEXT,
  p_cpf TEXT,
  p_telefone TEXT,
  p_email TEXT,
  p_cidade TEXT,
  p_uf TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id INTEGER;
BEGIN
  INSERT INTO ingressos (nome, cpf, telefone, email, cidade, uf)
  VALUES (p_nome, p_cpf, p_telefone, p_email, p_cidade, p_uf)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;
