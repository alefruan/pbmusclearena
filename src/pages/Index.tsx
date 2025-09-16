import { RegistrationForm } from '@/components/RegistrationForm';
import heroImage from '@/assets/hero-bodybuilding.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            NORDESTE LEGENDS
          </h1>
          <p className="text-xl md:text-2xl font-medium">
            Sistema de Inscrição Online
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Inscreva-se no Evento de Fisiculturismo
            </h2>
            <p className="text-lg text-muted-foreground">
              Preencha o formulário abaixo e gere automaticamente seu PDF de inscrição para impressão.
            </p>
          </div>

          <RegistrationForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">NORDESTE LEGENDS</h3>
          <p className="text-primary-foreground/80">
            Sistema de Inscrição Online - Evento de Fisiculturismo
          </p>
          <p className="text-sm text-primary-foreground/60 mt-4">
            © 2024 Nordeste Legends. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;