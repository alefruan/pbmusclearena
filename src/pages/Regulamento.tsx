import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Regulamento = () => {
  const [regulamentoTexto, setRegulamentoTexto] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegulamento();
  }, []);

  const fetchRegulamento = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'regulamento')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching regulation:', error);
      } else {
        setRegulamentoTexto(data?.value || getDefaultRegulamento());
      }
    } catch (error) {
      console.error('Error:', error);
      setRegulamentoTexto(getDefaultRegulamento());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultRegulamento = () => {
    return `
REGULAMENTO DO EVENTO DE FISICULTURISMO - PB MUSCLE ARENA

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
- WOMEN'S PHYSIQUE
- WELLNESS

3.2. CATEGORIAS MASCULINAS:
- BODYSHAPE
- ESPECIAL
- BODYBUILDING
- CLASSIC PHYSIQUE
- MEN'S PHYSIQUE

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
© 2024 - Todos os direitos reservados
    `.trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando regulamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex-1 text-center">
              <img
                src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
                alt="PB Muscle Arena Logo"
                className="w-full h-auto max-w-[200px] mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
              Regulamento do Evento
            </h1>

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {regulamentoTexto}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regulamento;