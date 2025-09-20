import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';
import ReCAPTCHA from 'react-google-recaptcha';

interface RegistrationData {
  id?: number;
  // Identificação
  nome: string;
  cpf: string;
  rg: string;
  idade: string;
  endereco: string;
  cidade: string;
  uf: string;
  telefone: string;
  email: string;

  // Pesagem e Medições
  altura: string;
  peso: string;
  pintura: boolean;
  foto: boolean;

  // Categorias
  genero: 'feminino' | 'masculino';
  categoria: string;
  subcategoria: string;

  // Regulamento
  regulamentoAceito: boolean;
}

const CATEGORIAS_FEMININAS = [
  'BIKINI',
  'FIGURE', 
  'WOMEN\'S PHYSIQUE',
  'WELLNESS'
];

const CATEGORIAS_MASCULINAS = [
  'BODYSHAPE',
  'ESPECIAL',
  'BODYBUILDING',
  'CLASSIC PHYSIQUE',
  'MEN\'S PHYSIQUE'
];

const SUBCATEGORIAS = [
  'TEEN',
  'ESTREANTE',
  'NOVICE',
  'OPEN',
  'MASTER',
  'CLASSE ESPECIAL'
];

export const RegistrationForm = () => {
  const { toast } = useToast();
  const [recaptchaRef, setRecaptchaRef] = useState<ReCAPTCHA | null>(null);
  const [formData, setFormData] = useState<RegistrationData>({
    nome: '',
    cpf: '',
    rg: '',
    idade: '',
    endereco: '',
    cidade: '',
    uf: '',
    telefone: '',
    email: '',
    altura: '0',
    peso: '0',
    pintura: false,
    foto: false,
    genero: 'masculino',
    categoria: 'BODYBUILDING',
    subcategoria: 'OPEN',
    regulamentoAceito: false
  });

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

  const handleInputChange = (field: keyof RegistrationData, value: string | boolean) => {
    if (typeof value === 'string') {
      if (field === 'cpf') {
        value = formatCPF(value);
      } else if (field === 'telefone') {
        value = formatTelefone(value);
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.nome || !formData.cpf || !formData.rg || !formData.idade || !formData.endereco || !formData.cidade || !formData.uf || !formData.telefone || !formData.email || !formData.regulamentoAceito) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios da identificação e aceite o regulamento do evento.",
        variant: "destructive"
      });
      return;
    }

    // Verificação do reCAPTCHA v2
    if (!recaptchaRef) {
      toast({
        title: "Erro de segurança",
        description: "reCAPTCHA não está disponível. Tente recarregar a página.",
        variant: "destructive"
      });
      return;
    }

    const recaptchaToken = recaptchaRef.getValue();
    if (!recaptchaToken) {
      toast({
        title: "Verificação de segurança",
        description: "Por favor, complete o reCAPTCHA.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('reCAPTCHA token:', recaptchaToken);

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
        // Reset do reCAPTCHA
        recaptchaRef.reset();
        return;
      }

    } catch (error) {
      console.error('reCAPTCHA error:', error);
      toast({
        title: "Erro de segurança",
        description: "Falha na verificação de segurança. Tente novamente.",
        variant: "destructive"
      });
      // Reset do reCAPTCHA
      recaptchaRef.reset();
      return;
    }

    // Validação de CPF (formato básico)
    const numericCPF = formData.cpf.replace(/\D/g, '');
    if (numericCPF.length < 11) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido com 11 dígitos.",
        variant: "destructive"
      });
      return;
    }

    // Validação de email
    if (!formData.email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Sending data to database:', formData);

      // Remove campos que não existem no banco de dados e limpa campos de categoria
      const { regulamentoAceito, genero, categoria, subcategoria, ...dataForDB } = formData;

      // Remove máscaras dos campos antes de salvar no banco
      const cleanedDataForDB = {
        ...dataForDB,
        cpf: dataForDB.cpf.replace(/\D/g, ''),
        telefone: dataForDB.telefone.replace(/\D/g, '')
      };

      // Adiciona campos de categoria como vazios para o banco
      const dataForDBWithEmptyCategories = {
        ...cleanedDataForDB,
        genero: '',
        categoria: '',
        subcategoria: ''
      };

      console.log('Data for database (without regulamentoAceito and with empty categories):', dataForDBWithEmptyCategories);

      const { data, error } = await supabase.from('registrations').insert([dataForDBWithEmptyCategories]).select();

      if (error) {
        console.error('Database error details:', error);

        if (error.message.includes('relation "public.registrations" does not exist')) {
          console.warn('Database not configured, generating PDF and sending email');
          try {
            // Gerar PDF local
            await generatePDF(formData);

            // Tentar enviar email mesmo sem banco
            try {
              console.log('Enviando email de confirmação...');
              const emailResponse = await supabase.functions.invoke('send-email', {
                body: { registrationData: formData }
              });

              if (emailResponse.error) {
                console.error('Erro ao enviar email:', emailResponse.error);
                toast({
                  title: "PDF gerado!",
                  description: "PDF gerado com sucesso, mas houve erro ao enviar email. Configure o banco para salvar os dados.",
                  variant: "default"
                });
              } else {
                const isSimulation = emailResponse.data?.simulation;
                toast({
                  title: "PDF gerado e email enviado!",
                  description: isSimulation
                    ? "PDF gerado e email simulado com sucesso! Configure Resend e o banco para funcionalidade completa."
                    : "PDF gerado e email enviado com sucesso! Configure o banco para salvar os dados.",
                  variant: "default"
                });
              }
            } catch (emailError) {
              console.error('Erro no envio de email:', emailError);
              toast({
                title: "PDF gerado!",
                description: "PDF gerado com sucesso, mas houve erro ao enviar email. Configure o banco para salvar os dados.",
                variant: "default"
              });
            }

            return;
          } catch (pdfError) {
            console.error('PDF generation error:', pdfError);
            toast({
              title: "Erro completo",
              description: "Banco não configurado E erro ao gerar PDF. Configure o banco primeiro.",
              variant: "destructive"
            });
            return;
          }
        }

        if (error.code === '23502') {
          toast({
            title: "Erro de validação",
            description: `Campo obrigatório não preenchido: ${error.details}`,
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Erro no banco de dados",
          description: `${error.message} (Código: ${error.code})`,
          variant: "destructive"
        });
        return;
      }

      console.log('Data saved successfully:', data);

      try {
        // Gerar PDF local para download imediato
        await generatePDF(formData);

        // Enviar email com PDF anexado
        try {
          console.log('Enviando email de confirmação...');
          const emailResponse = await supabase.functions.invoke('send-email', {
            body: { registrationData: formData }
          });

          if (emailResponse.error) {
            console.error('Erro ao enviar email:', emailResponse.error);
            toast({
              title: "Inscrição realizada!",
              description: "PDF gerado com sucesso, mas houve erro ao enviar o email de confirmação.",
              variant: "default"
            });
          } else {
            const isSimulation = emailResponse.data?.simulation;
            toast({
              title: "Inscrição realizada!",
              description: isSimulation
                ? "PDF gerado e email simulado com sucesso! (Configure Resend para envio real)"
                : "PDF gerado e email de confirmação enviado com sucesso!",
            });
          }
        } catch (emailError) {
          console.error('Erro no envio de email:', emailError);
          toast({
            title: "Inscrição realizada!",
            description: "PDF gerado com sucesso, mas houve erro ao enviar o email de confirmação.",
            variant: "default"
          });
        }

      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        toast({
          title: "Dados salvos, mas erro no PDF",
          description: "Inscrição salva com sucesso, mas houve erro ao gerar o PDF.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao processar inscrição. Verifique o console para detalhes.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Identificação */}
      <Card className="shadow-card">
        <CardHeader className="bg-yellow-400 text-black rounded-t-lg">
          <CardTitle className="text-xl font-bold">IDENTIFICAÇÃO</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome" className="text-sm font-medium">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf" className="text-sm font-medium">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                className="mt-1"
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div>
              <Label htmlFor="rg" className="text-sm font-medium">RG *</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => handleInputChange('rg', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="idade" className="text-sm font-medium">Idade *</Label>
              <Input
                id="idade"
                type="number"
                value={formData.idade}
                onChange={(e) => handleInputChange('idade', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="endereco" className="text-sm font-medium">Endereço *</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="cidade" className="text-sm font-medium">Cidade *</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="uf" className="text-sm font-medium">UF *</Label>
              <Input
                id="uf"
                value={formData.uf}
                onChange={(e) => handleInputChange('uf', e.target.value)}
                className="mt-1"
                maxLength={2}
                placeholder="PB"
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone" className="text-sm font-medium">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className="mt-1"
                placeholder="(00) 00000-0000"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aceitação do Regulamento */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="regulamento"
              checked={formData.regulamentoAceito}
              onCheckedChange={(checked) => handleInputChange('regulamentoAceito', checked === true)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="regulamento" className="text-sm font-medium cursor-pointer">
                Li e aceito o{' '}
                <Link to="/regulamento" className="text-primary hover:underline font-semibold" target="_blank">
                  regulamento do evento
                </Link>{' '}
                *
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                É obrigatório aceitar o regulamento para realizar a inscrição
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* reCAPTCHA v2 */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={(ref) => setRecaptchaRef(ref)}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              theme="light"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-6">
        <Button
          type="submit"
          size="lg"
          className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-accent text-lg px-12 py-3 shadow-elegant"
        >
          Gerar Inscrição PDF
        </Button>
      </div>
    </form>
  );
};