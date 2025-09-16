import { RegistrationForm } from '@/components/RegistrationForm';
import heroImage from '@/assets/hero-bodybuilding.jpg';
import { Link } from 'react-router-dom';

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