-- Script para criar as tabelas necessárias no Supabase

-- Tabela para armazenar as inscrições
CREATE TABLE IF NOT EXISTS public.registrations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Identificação
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL,
    rg TEXT,
    idade TEXT,
    endereco TEXT,
    cidade TEXT,
    uf TEXT,
    telefone TEXT,
    email TEXT NOT NULL,

    -- Pesagem e Medições
    altura TEXT,
    peso TEXT,
    pintura BOOLEAN DEFAULT false,
    foto BOOLEAN DEFAULT false,

    -- Categorias
    genero TEXT CHECK (genero IN ('feminino', 'masculino')),
    categoria TEXT,
    subcategoria TEXT
);

-- Tabela para configurações do sistema (incluindo texto do regulamento)
CREATE TABLE IF NOT EXISTS public.settings (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    key TEXT UNIQUE NOT NULL,
    value TEXT
);

-- Inserir valor padrão para o regulamento
INSERT INTO public.settings (key, value) VALUES (
    'regulamento',
    'REGULAMENTO DO EVENTO DE FISICULTURISMO - PB MUSCLE ARENA

1. DISPOSIÇÕES GERAIS

1.1. O presente regulamento tem por objetivo estabelecer as regras e condições para participação no evento de fisiculturismo promovido pela PB MUSCLE ARENA.

1.2. A participação no evento implica na aceitação integral deste regulamento.

2. INSCRIÇÕES

2.1. As inscrições deverão ser realizadas exclusivamente através do sistema online disponibilizado.

2.2. O participante deverá preencher corretamente todos os dados solicitados no formulário de inscrição.

2.3. É de responsabilidade do participante verificar a categoria e subcategoria em que está se inscrevendo.

3. CATEGORIAS

3.1. CATEGORIAS FEMININAS:
- BIKINI
- FIGURE
- WOMEN''S PHYSIQUE
- WELLNESS

3.2. CATEGORIAS MASCULINAS:
- BODYSHAPE
- ESPECIAL
- BODYBUILDING
- CLASSIC PHYSIQUE
- MEN''S PHYSIQUE

3.3. SUBCATEGORIAS:
- TEEN
- ESTREANTE
- NOVICE
- OPEN
- MASTER
- CLASSE ESPECIAL

4. PESAGEM E MEDIÇÕES

4.1. Todos os participantes deverão comparecer à pesagem oficial no dia e horário determinado pela organização.

4.2. A altura será medida durante a pesagem oficial.

4.3. Os serviços de pintura e fotografias serão opcionais e deverão ser indicados no momento da inscrição.

5. DIREITOS DE IMAGEM

5.1. Ao participar do evento, o atleta autoriza a organização a utilizar sua imagem para fins de divulgação do evento e da modalidade.

5.2. As imagens poderão ser utilizadas em materiais promocionais, site oficial, redes sociais e demais mídias.

6. RESPONSABILIDADES

6.1. A organização não se responsabiliza por objetos perdidos ou danificados durante o evento.

6.2. Cada participante é responsável por sua própria saúde e condicionamento físico.

6.3. É recomendado que todos os participantes tenham acompanhamento médico adequado.

7. COMPORTAMENTO

7.1. Todos os participantes deverão manter comportamento adequado e respeitoso durante todo o evento.

7.2. Atitudes inadequadas poderão resultar na desclassificação do participante.

8. DISPOSIÇÕES FINAIS

8.1. A organização reserva-se o direito de alterar este regulamento a qualquer momento.

8.2. Casos omissos serão decididos pela organização do evento.

8.3. O não cumprimento das regras estabelecidas resultará na desclassificação do participante.

Para mais informações, entre em contato com a organização do evento.

PB MUSCLE ARENA
© 2024 - Todos os direitos reservados'
) ON CONFLICT (key) DO NOTHING;

-- Inserir valor padrão para o status das inscrições (abertas por padrão)
INSERT INTO public.settings (key, value) VALUES (
    'inscricoes_abertas',
    'true'
) ON CONFLICT (key) DO NOTHING;

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acesso público às tabelas
CREATE POLICY "Enable read access for all users" ON public.registrations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.registrations FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.registrations FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.settings FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.settings FOR DELETE USING (true);

-- Opcional: Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_registrations_cpf ON public.registrations(cpf);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_nome ON public.registrations(nome);
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);