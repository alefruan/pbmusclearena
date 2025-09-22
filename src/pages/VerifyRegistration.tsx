import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Search, Mail } from 'lucide-react';
import { generatePDF } from '@/utils/pdfGenerator';

interface RegistrationData {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  rg?: string;
  idade?: string;
  endereco?: string;
  altura?: string;
  peso?: string;
  pintura?: boolean;
  foto?: boolean;
  genero?: 'feminino' | 'masculino';
  categoria?: string;
  subcategoria?: string;
}

export const VerifyRegistration = () => {
  const { toast } = useToast();
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    registration?: RegistrationData;
    searched: boolean;
  }>({ found: false, searched: false });
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const formatCPF = (cpf: string) => {
    const numericCPF = cpf.replace(/\D/g, '').slice(0, 11);
    return numericCPF
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleCPFChange = (value: string) => {
    const formattedCPF = formatCPF(value);
    setCpf(formattedCPF);
    // Reset search result when CPF changes
    setSearchResult({ found: false, searched: false });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação básica de CPF
    const numericCPF = cpf.replace(/\D/g, '');
    if (numericCPF.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido com 11 dígitos.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log('Buscando inscrição para CPF:', numericCPF);

      const { data: registrations, error } = await supabase
        .from('registrations')
        .select('id, nome, cpf, email, telefone, cidade, uf')
        .eq('cpf', numericCPF);

      if (error) {
        console.error('Erro na busca:', error);

        if (error.message.includes('relation "public.registrations" does not exist')) {
          toast({
            title: "Banco não configurado",
            description: "O sistema de verificação não está configurado. Entre em contato com o suporte.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro na busca",
            description: "Erro ao buscar inscrição. Tente novamente.",
            variant: "destructive"
          });
        }
        setSearchResult({ found: false, searched: true });
      } else if (registrations && registrations.length > 0) {
        setSearchResult({
          found: true,
          registration: registrations[0],
          searched: true
        });
      } else {
        setSearchResult({ found: false, searched: true });
      }
    } catch (searchError) {
      console.error('Erro inesperado na busca:', searchError);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao buscar inscrição. Tente novamente.",
        variant: "destructive"
      });
      setSearchResult({ found: false, searched: true });
    }

    setIsLoading(false);
  };

  const handleResendEmail = async () => {
    if (!searchResult.registration) return;

    setIsResendingEmail(true);

    try {
      // Criar objeto de dados completo para o PDF e email
      const registrationDataForEmail = {
        ...searchResult.registration,
        // Adicionar campos padrão caso não existam
        rg: searchResult.registration.rg || '',
        idade: searchResult.registration.idade || '',
        endereco: searchResult.registration.endereco || '',
        altura: searchResult.registration.altura || '0',
        peso: searchResult.registration.peso || '0',
        pintura: searchResult.registration.pintura || false,
        foto: searchResult.registration.foto || false,
        genero: searchResult.registration.genero || 'masculino',
        categoria: searchResult.registration.categoria || 'OPEN',
        subcategoria: searchResult.registration.subcategoria || 'OPEN',
        regulamentoAceito: true
      };

      console.log('Reenviando email para:', registrationDataForEmail);

      // Enviar email com PDF anexado
      const emailResponse = await supabase.functions.invoke('send-email', {
        body: { registrationData: registrationDataForEmail }
      });

      if (emailResponse.error) {
        console.error('Erro ao reenviar email:', emailResponse.error);
        toast({
          title: "Erro ao reenviar email",
          description: "Houve um problema ao reenviar o email de confirmação. Tente novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email reenviado!",
          description: `Email de confirmação com PDF foi reenviado para ${searchResult.registration.email} e para inscricao@pbmusclearena.com`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erro inesperado ao reenviar email:', error);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao reenviar email. Tente novamente.",
        variant: "destructive"
      });
    }

    setIsResendingEmail(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verificar Inscrição
          </h1>
          <p className="text-lg text-gray-600">
            Digite seu CPF para verificar se você já possui uma inscrição no evento
          </p>
        </div>

        {/* Search Form */}
        <Card className="shadow-card mb-8">
          <CardHeader className="bg-orange-500 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar por CPF
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="cpf" className="text-sm font-medium">
                  CPF *
                </Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => handleCPFChange(e.target.value)}
                  className="mt-1"
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
              >
                {isLoading ? "Buscando..." : "Verificar Inscrição"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResult.searched && (
          <Card className="shadow-card">
            <CardContent className="p-6">
              {searchResult.found && searchResult.registration ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700">
                    Inscrição Encontrada!
                  </h2>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold text-gray-700">Nome:</span>
                        <p className="text-gray-900">{searchResult.registration.nome}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">CPF:</span>
                        <p className="text-gray-900">{formatCPF(searchResult.registration.cpf)}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">E-mail:</span>
                        <p className="text-gray-900">{searchResult.registration.email}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Telefone:</span>
                        <p className="text-gray-900">{searchResult.registration.telefone}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Cidade:</span>
                        <p className="text-gray-900">{searchResult.registration.cidade}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">UF:</span>
                        <p className="text-gray-900">{searchResult.registration.uf}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Sua inscrição foi encontrada no sistema. Se você precisar fazer alguma alteração,
                    entre em contato com a organização do evento.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      onClick={handleResendEmail}
                      disabled={isResendingEmail}
                      className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      {isResendingEmail ? "Reenviando..." : "Reenviar Email de Confirmação"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <XCircle className="w-16 h-16 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-700">
                    Inscrição Não Encontrada
                  </h2>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">
                      Não foi encontrada nenhuma inscrição para o CPF informado.
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Se você ainda não se inscreveu, pode fazer sua inscrição clicando no botão abaixo.
                  </p>
                  <Link to="/">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Fazer Inscrição
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};