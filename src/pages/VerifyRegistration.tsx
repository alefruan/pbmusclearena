import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Search, Mail, ArrowLeft } from 'lucide-react';

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
    setCpf(formatCPF(value));
    setSearchResult({ found: false, searched: false });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
      const { data: registrations, error } = await supabase
        .from('registrations')
        .select('id, nome, cpf, email, telefone, cidade, uf')
        .eq('cpf', numericCPF);

      if (error) {
        toast({
          title: "Erro na busca",
          description: "Erro ao buscar inscrição. Tente novamente.",
          variant: "destructive"
        });
        setSearchResult({ found: false, searched: true });
      } else if (registrations && registrations.length > 0) {
        setSearchResult({ found: true, registration: registrations[0], searched: true });
      } else {
        setSearchResult({ found: false, searched: true });
      }
    } catch {
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
      const registrationDataForEmail = {
        ...searchResult.registration,
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

      const emailResponse = await supabase.functions.invoke('send-email', {
        body: { registrationData: registrationDataForEmail }
      });

      if (emailResponse.error) {
        toast({
          title: "Erro ao reenviar email",
          description: "Houve um problema ao reenviar o email de confirmação. Tente novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email reenviado!",
          description: `Email reenviado para ${searchResult.registration.email}`,
        });
      }
    } catch {
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao reenviar email. Tente novamente.",
        variant: "destructive"
      });
    }

    setIsResendingEmail(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Top bar */}
      <div className="border-b border-white/10 bg-zinc-900">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-orange-400 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
          <img
            src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
            alt="PB Muscle Arena"
            className="h-7 w-auto opacity-80"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 max-w-xl">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-orange-600/20 text-orange-400 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-orange-600/30">
            Verificação
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Verificar Inscrição
          </h1>
          <p className="text-white/40 text-base">
            Digite seu CPF para consultar sua inscrição no evento
          </p>
        </div>

        {/* Search card */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden mb-6">
          {/* card top accent */}
          <div className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-orange-600/20 flex items-center justify-center border border-orange-600/30">
                <Search className="w-4 h-4 text-orange-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Buscar por CPF</h2>
            </div>

            <form onSubmit={handleSearch} className="space-y-5">
              <div>
                <Label htmlFor="cpf" className="text-sm font-medium text-white/60 mb-1.5 block">
                  CPF *
                </Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => handleCPFChange(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-white/20 focus:border-orange-500 focus:ring-orange-500/20 h-11"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-orange-900/40 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Buscando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Verificar Inscrição
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Result */}
        {searchResult.searched && (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className={`h-1 ${searchResult.found ? 'bg-gradient-to-r from-transparent via-green-500 to-transparent' : 'bg-gradient-to-r from-transparent via-red-500 to-transparent'}`} />

            <div className="p-8 text-center space-y-5">
              {searchResult.found && searchResult.registration ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto border border-green-500/30">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1">Inscrição Encontrada!</h2>
                    <p className="text-white/40 text-sm">Seus dados estão confirmados no sistema</p>
                  </div>

                  <div className="bg-zinc-800 border border-white/10 rounded-xl p-5 text-left space-y-3">
                    {[
                      { label: 'Nome', value: searchResult.registration.nome },
                      { label: 'CPF', value: formatCPF(searchResult.registration.cpf) },
                      { label: 'E-mail', value: searchResult.registration.email },
                      { label: 'Telefone', value: searchResult.registration.telefone },
                      { label: 'Cidade', value: `${searchResult.registration.cidade} — ${searchResult.registration.uf}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-white/5 last:border-0">
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/30 shrink-0 pt-0.5">{label}</span>
                        <span className="text-sm text-white/80 text-right">{value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-white/30 text-xs">
                    Para alterações, entre em contato com a organização do evento.
                  </p>

                  <Button
                    onClick={handleResendEmail}
                    disabled={isResendingEmail}
                    className="w-full h-11 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    {isResendingEmail ? "Reenviando..." : "Reenviar Email de Confirmação"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto border border-red-500/30">
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1">Não Encontrado</h2>
                    <p className="text-white/40 text-sm">Nenhuma inscrição para o CPF informado</p>
                  </div>

                  <div className="bg-zinc-800 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400 text-sm">
                      Verifique se o CPF digitado está correto ou realize sua inscrição.
                    </p>
                  </div>

                  <Link to="/">
                    <Button className="w-full h-11 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-orange-900/40">
                      Fazer Inscrição
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-zinc-900 py-8 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-white/25">
            © 2026 PB MUSCLE ARENA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
