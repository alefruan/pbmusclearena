import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Ticket, ArrowLeft } from 'lucide-react';

interface IngressoSucessoState {
  nomeCompleto: string;
  ingressoId: number;
}

const IngressoSucesso: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as IngressoSucessoState;

  // Se não há dados do state, redireciona para a página de ingressos
  if (!state || !state.nomeCompleto) {
    navigate('/ingressos');
    return null;
  }

  const { nomeCompleto, ingressoId } = state;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <img
        src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
        alt="PB Muscle Arena Logo"
        className="w-full h-auto max-w-xs mx-auto mb-8"
      />

      <Card className="shadow-card text-center">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold">Ingresso Registrado com Sucesso!</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Ticket className="h-12 w-12 text-primary" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Parabéns, {nomeCompleto}!
            </h2>

            <p className="text-muted-foreground">
              Seu ingresso foi registrado com sucesso no nosso sistema.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-primary">
              <p className="text-sm font-medium text-gray-700 mb-2">Número do Ingresso:</p>
              <p className="text-2xl font-bold text-primary">#{String(ingressoId).padStart(6, '0')}</p>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Importante:</strong> Guarde este número do ingresso para futuras consultas.
              </p>
              <p>
                Você receberá mais informações sobre o evento em breve no email cadastrado.
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-accent"
            >
              Voltar ao Início
            </Button>

            <Button
              onClick={() => navigate('/ingressos')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cadastrar Outro Ingresso
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Em caso de dúvidas, entre em contato conosco através dos nossos canais oficiais.
        </p>
      </div>
    </div>
  );
};

export default IngressoSucesso;