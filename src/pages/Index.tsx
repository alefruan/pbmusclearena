import { RegistrationForm } from '@/components/RegistrationForm';
import heroImage from '@/assets/hero-bodybuilding.jpg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const Index = () => {
  const [inscricoesAbertas, setInscricoesAbertas] = useState(true);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchInscricoesStatus();

    const calculateTimeLeft = () => {
      const targetDate = new Date('2025-09-22T00:00:00-03:00');
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchInscricoesStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'inscricoes_abertas')
        .single();

      if (error) {
        console.error('Error fetching inscricoes status:', error);
        setInscricoesAbertas(true);
      } else {
        setInscricoesAbertas(data?.value === 'true');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setInscricoesAbertas(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white">
          <img
            src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
            alt="PB Muscle Arena Logo"
            className="w-full h-auto max-w-xs mx-auto mb-4"
          />
          <p className="text-xl md:text-2xl font-medium">
            Sistema de Inscrição Online
          </p>
          <div className="mt-4 mb-4">
            <Link
              to="/verificar"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verificar Inscrição
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <a
              href="https://chat.whatsapp.com/JnNyceV1FQO3zSldZWIw2o?mode=ems_wa_c"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base hover:underline"
            >
              Para novidades e informações, entre no grupo do WhatsApp
            </a>
            <svg
              className="w-6 h-6 text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {inscricoesAbertas ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Inscreva-se no Evento de Fisiculturismo
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Preencha o formulário abaixo e gere automaticamente seu PDF de inscrição para impressão.
                </p>
                <p className="text-base text-muted-foreground">
                  Verifique se você já está inscrito{' '}
                  <Link
                    to="/verificar"
                    className="text-orange-600 hover:text-orange-700 font-medium underline"
                  >
                    clique aqui
                  </Link>
                </p>
              </div>

              <RegistrationForm />
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
                <div className="text-red-600 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-red-800 mb-4">
                  Inscrições Fechadas
                </h2>
                <p className="text-lg text-red-700 mb-6">
                  Infelizmente o período de inscrições não está disponível no momento.
                </p>

                <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    As inscrições abrirão em:
                  </h3>
                  <div className="flex justify-center gap-2 md:gap-4 text-center">
                    <div className="bg-orange-100 rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[80px]">
                      <div className="text-xl md:text-2xl font-bold text-orange-600">{timeLeft.days}</div>
                      <div className="text-xs md:text-sm text-orange-600">Dias</div>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[80px]">
                      <div className="text-xl md:text-2xl font-bold text-orange-600">{timeLeft.hours}</div>
                      <div className="text-xs md:text-sm text-orange-600">Horas</div>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[80px]">
                      <div className="text-xl md:text-2xl font-bold text-orange-600">{timeLeft.minutes}</div>
                      <div className="text-xs md:text-sm text-orange-600">Minutos</div>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[80px]">
                      <div className="text-xl md:text-2xl font-bold text-orange-600">{timeLeft.seconds}</div>
                      <div className="text-xs md:text-sm text-orange-600">Segundos</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4 text-sm">
                    Abertura: 22 de setembro de 2025 às 00:00 (horário de Brasília)
                  </p>
                </div>
                <p className="text-red-600">
                  Acompanhe nosso site para ficar por dentro do periodo de inscrição!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <img
            src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
            alt="PB Muscle Arena Logo"
            className="w-full h-auto max-w-[200px] mx-auto mb-2"
          />
          <p className="text-primary-foreground/80">
            Sistema de Inscrição Online - Evento de Fisiculturismo
          </p>
          <p className="text-sm text-primary-foreground/60 mt-4">
            © 2024 PB MUSCLE ARENA. Todos os direitos reservados.
          </p>
          <div className="mt-2 space-x-4">
            <Link to="/verificar" className="text-primary-foreground/80 hover:underline">
              Verificar Inscrição
            </Link>
            <Link to="/admin" className="text-primary-foreground/80 hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;