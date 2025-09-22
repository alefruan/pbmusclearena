import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, GraduationCap, ArrowLeft } from 'lucide-react';

interface CursoSucessoState {
  nomeCompleto: string;
  cursoId: number;
  cursos: string[];
}

const CursoSucesso: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CursoSucessoState;

  // Se não há dados do state, redireciona para a página de cursos
  if (!state || !state.nomeCompleto) {
    navigate('/cursos');
    return null;
  }

  const { nomeCompleto, cursoId, cursos } = state;

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
          <CardTitle className="text-2xl font-bold">Inscrição no Curso Confirmada!</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Parabéns, {nomeCompleto}!
            </h2>

            <p className="text-muted-foreground">
              Sua inscrição no curso foi registrada com sucesso no nosso sistema.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-primary">
              <p className="text-sm font-medium text-gray-700 mb-2">Número da Inscrição:</p>
              <p className="text-2xl font-bold text-primary">#{String(cursoId).padStart(6, '0')}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border-2 border-dashed border-blue-400">
              <p className="text-sm font-medium text-blue-700 mb-2">
                {cursos.length === 1 ? 'Curso Selecionado:' : 'Cursos Selecionados:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {cursos.map((curso, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {curso}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Importante:</strong> Guarde este número da inscrição para futuras consultas.
              </p>
              <p>
                Você receberá mais informações sobre o curso e cronograma em breve no email cadastrado.
              </p>
              <p>
                <strong>Data do Evento:</strong> 15 e 16 de Novembro de 2025
              </p>
              <p>
                <strong>Local:</strong> Teatro Pedra do Reino - João Pessoa, PB
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
              onClick={() => navigate('/cursos')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Inscrever-se em Outro Curso
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Em caso de dúvidas, entre em contato conosco através do email cursos@pbmusclearena.com
        </p>
      </div>
    </div>
  );
};

export default CursoSucesso;