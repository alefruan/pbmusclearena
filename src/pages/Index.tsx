import { RegistrationForm } from '@/components/RegistrationForm';
import heroImage from '@/assets/hero-bodybuilding.jpg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const Index = () => {
  const [inscricoesAbertas, setInscricoesAbertas] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInscricoesStatus();
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
                <p className="text-lg text-muted-foreground">
                  Preencha o formulário abaixo e gere automaticamente seu PDF de inscrição para impressão.
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
                  Infelizmente o período de inscrições para o evento foi encerrado.
                </p>
                <p className="text-red-600">
                  Acompanhe nossas redes sociais para ficar sabendo de novos eventos e oportunidades!
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
          <div className="mt-2">
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