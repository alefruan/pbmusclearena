import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { computeIsOpen } from '@/lib/scheduleUtils';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

interface IngressoData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
}

const UFS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const Ingressos: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recaptchaRef, setRecaptchaRef] = useState<ReCAPTCHA | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ingressosAbertos, setIngressosAbertos] = useState(true);
  const [formData, setFormData] = useState<IngressoData>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    cidade: '',
    uf: 'PB'
  });

  useEffect(() => {
    checkIngressosStatus();
  }, []);

  const checkIngressosStatus = async () => {
    try {
      const keys = ['ingressos_abertos', 'ingressos_open_at', 'ingressos_close_at'];
      const { data, error } = await supabase
        .from('settings')
        .select('key,value')
        .in('key', keys);

      if (error) {
        console.warn('Erro ao verificar status dos ingressos:', error);
        setIngressosAbertos(true);
      } else {
        const map = Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));
        const manual = map['ingressos_abertos'] === 'true';
        const isOpen = computeIsOpen(manual, map['ingressos_open_at'], map['ingressos_close_at']);
        setIngressosAbertos(isOpen);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setIngressosAbertos(true);
    }
  };

  const formatCPF = (cpf: string) => {
    const numericCPF = cpf.replace(/\D/g, '').slice(0, 11);
    return numericCPF
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatTelefone = (telefone: string) => {
    const numericTel = telefone.replace(/\D/g, '').slice(0, 11);
    return numericTel
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleInputChange = (field: keyof IngressoData, value: string) => {
    if (field === 'cpf') {
      value = formatCPF(value);
    } else if (field === 'telefone') {
      value = formatTelefone(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!ingressosAbertos) {
      toast({
        title: "Ingressos fechados",
        description: "Os ingressos estão temporariamente fechados.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Validação básica
    if (!formData.nome || !formData.cpf || !formData.telefone || !formData.email || !formData.cidade || !formData.uf) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Verificação do reCAPTCHA v2
    if (!recaptchaRef) {
      toast({
        title: "Erro de segurança",
        description: "reCAPTCHA não está disponível. Tente recarregar a página.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const recaptchaToken = recaptchaRef.getValue();
    if (!recaptchaToken) {
      toast({
        title: "Verificação de segurança",
        description: "Por favor, complete o reCAPTCHA.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Validar token no backend
      const recaptchaResponse = await supabase.functions.invoke('verify-recaptcha', {
        body: { token: recaptchaToken }
      });

      if (recaptchaResponse.error || !recaptchaResponse.data?.success) {
        toast({
          title: "Verificação de segurança falhou",
          description: "Por favor, tente novamente.",
          variant: "destructive"
        });
        recaptchaRef.reset();
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      toast({
        title: "Erro de segurança",
        description: "Falha na verificação de segurança. Tente novamente.",
        variant: "destructive"
      });
      recaptchaRef.reset();
      setIsLoading(false);
      return;
    }

    // Validação de CPF
    const numericCPF = formData.cpf.replace(/\D/g, '');
    if (numericCPF.length < 11) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido com 11 dígitos.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Validação de email
    if (!formData.email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Verificação de CPF duplicado
    try {
      const cleanCPF = formData.cpf.replace(/\D/g, '');

      const { data: existingIngressos, error: searchError } = await supabase
        .from('ingressos')
        .select('id, nome')
        .eq('cpf', cleanCPF);

      if (searchError && !searchError.message.includes('relation "public.ingressos" does not exist')) {
        console.error('Erro ao verificar CPF:', searchError);
      } else if (existingIngressos && existingIngressos.length > 0) {
        const existingIngresso = existingIngressos[0];
        toast({
          title: "CPF já cadastrado",
          description: `Já existe um ingresso para este CPF em nome de ${existingIngresso.nome}.`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
    } catch (cpfCheckError) {
      console.warn('Erro na verificação de CPF:', cpfCheckError);
    }

    try {
      // Remove máscaras dos campos antes de salvar
      const cleanedData = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, '')
      };

      const { data, error } = await supabase
        .from('ingressos')
        .insert([cleanedData])
        .select();

      if (error) {
        console.error('Database error:', error);

        if (error.message.includes('relation "public.ingressos" does not exist')) {
          toast({
            title: "Banco não configurado",
            description: "Tabela de ingressos não encontrada. Execute o script database-setup.sql no Supabase primeiro.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no banco de dados",
            description: `${error.message}`,
            variant: "destructive"
          });
        }
        setIsLoading(false);
        return;
      }

      console.log('Ingresso salvo com sucesso:', data);

      // Enviar email de confirmação
      try {
        console.log('Enviando email de confirmação do ingresso...');
        const emailResponse = await supabase.functions.invoke('send-ingresso-email', {
          body: {
            ingressoData: {
              ...formData,
              ingressoId: data[0].id
            }
          }
        });

        if (emailResponse.error) {
          console.error('Erro ao enviar email de ingresso:', emailResponse.error);
          toast({
            title: "Ingresso registrado!",
            description: "Ingresso cadastrado com sucesso, mas houve erro ao enviar o email de confirmação.",
            variant: "default"
          });
        } else {
          console.log('Email de ingresso enviado com sucesso');
        }
      } catch (emailError) {
        console.error('Erro no envio de email de ingresso:', emailError);
        toast({
          title: "Ingresso registrado!",
          description: "Ingresso cadastrado com sucesso, mas houve erro ao enviar o email de confirmação.",
          variant: "default"
        });
      }

      // Redirecionar para página de sucesso
      navigate('/ingresso-sucesso', {
        state: {
          nomeCompleto: formData.nome,
          ingressoId: data[0].id
        }
      });

    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao processar ingresso. Tente novamente.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  if (!ingressosAbertos) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <img
            src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
            alt="PB Muscle Arena Logo"
            className="w-full h-auto max-w-xs mx-auto mb-8"
          />
          <div className="border border-yellow-400 rounded-2xl p-8 bg-zinc-900">
            <h1 className="text-2xl font-black mb-3 text-yellow-400 uppercase tracking-widest">Ingressos Fechados</h1>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Os ingressos para o <span className="text-white font-bold">PB MUSCLE ARENA 2026</span> estão temporariamente fechados.
              Entre em contato conosco para mais informações.
            </p>
            <Button onClick={() => navigate('/')} variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold">
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-zinc-900 to-black pt-10 pb-8 px-4 text-center border-b border-zinc-800">
        <img
          src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
          alt="PB Muscle Arena Logo"
          className="w-full h-auto max-w-xs mx-auto mb-6"
        />
        <div className="inline-block bg-yellow-400 text-black text-xs font-black px-4 py-1 rounded-full tracking-widest uppercase mb-4">
          Edição 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
          PB MUSCLE ARENA
          <span className="block text-yellow-400">2026</span>
        </h1>
        <p className="text-zinc-400 mt-4 text-sm max-w-sm mx-auto">
          Garanta agora o seu ingresso para o maior evento de fisiculturismo da Paraíba
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <div className="bg-yellow-400 px-6 py-4">
              <h2 className="text-black font-black text-sm uppercase tracking-widest">Dados Pessoais</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nome" className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-yellow-400 focus:ring-yellow-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cpf" className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-yellow-400"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefone" className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-yellow-400"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email" className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-yellow-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cidade" className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Cidade *</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-yellow-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="uf" className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">UF *</Label>
                  <Select value={formData.uf} onValueChange={(value) => handleInputChange('uf', value)}>
                    <SelectTrigger className="mt-2 bg-zinc-800 border-zinc-700 text-white focus:border-yellow-400">
                      <SelectValue placeholder="Selecione a UF" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      {UFS_BRASIL.map((uf) => (
                        <SelectItem key={uf} value={uf} className="focus:bg-yellow-400 focus:text-black">
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* reCAPTCHA */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex justify-center">
            <ReCAPTCHA
              ref={(ref) => setRecaptchaRef(ref)}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              theme="dark"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-base uppercase tracking-widest py-6 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "Cadastrando..." : "Garantir Meu Ingresso"}
          </Button>

          <p className="text-center text-zinc-600 text-xs">
            Ao se cadastrar, você confirma que as informações fornecidas são verdadeiras.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Ingressos;