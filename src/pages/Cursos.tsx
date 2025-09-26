import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

interface CursoData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
  cursos: string[];
}

const UFS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const CURSOS_OPCOES = [
  'Nutrição Esportiva',
  'Treinamento Físico',
  'Capacitação para árbitros',
  'Todos os cursos'
];

const Cursos: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recaptchaRef, setRecaptchaRef] = useState<ReCAPTCHA | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inscricoesAbertas, setInscricoesAbertas] = useState(true);
  const [formData, setFormData] = useState<CursoData>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    cidade: '',
    uf: 'PB',
    cursos: []
  });

  useEffect(() => {
    checkInscricoesStatus();
  }, []);

  const checkInscricoesStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'inscricoes_abertas')
        .single();

      if (error) {
        console.warn('Erro ao verificar status das inscrições:', error);
        setInscricoesAbertas(true);
      } else {
        setInscricoesAbertas(data?.value === 'true');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setInscricoesAbertas(true);
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

  const handleInputChange = (field: keyof CursoData, value: string) => {
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

  const handleCursoToggle = (curso: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      cursos: checked
        ? [...prev.cursos, curso]
        : prev.cursos.filter(c => c !== curso)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!inscricoesAbertas) {
      toast({
        title: "Inscrições fechadas",
        description: "As inscrições para cursos estão temporariamente fechadas.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Validação básica
    if (!formData.nome || !formData.cpf || !formData.telefone || !formData.email || !formData.cidade || !formData.uf || formData.cursos.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios e selecione pelo menos um curso.",
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

      const { data: existingCursos, error: searchError } = await supabase
        .from('cursos')
        .select('id, nome')
        .eq('cpf', cleanCPF);

      if (searchError && !searchError.message.includes('relation "public.cursos" does not exist')) {
        console.error('Erro ao verificar CPF:', searchError);
      } else if (existingCursos && existingCursos.length > 0) {
        const existingCurso = existingCursos[0];
        toast({
          title: "CPF já cadastrado",
          description: `Já existe uma inscrição de curso para este CPF em nome de ${existingCurso.nome}.`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
    } catch (cpfCheckError) {
      console.warn('Erro na verificação de CPF:', cpfCheckError);
    }

    try {
      // Remove máscaras dos campos antes de salvar e converte array de cursos em string
      const cleanedData = {
        nome: formData.nome,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, ''),
        email: formData.email,
        cidade: formData.cidade,
        uf: formData.uf,
        curso: formData.cursos.join(', ') // Converte array em string separada por vírgulas
      };

      const { data, error } = await supabase
        .from('cursos')
        .insert([cleanedData])
        .select();

      if (error) {
        console.error('Database error:', error);

        if (error.message.includes('relation "public.cursos" does not exist')) {
          toast({
            title: "Banco não configurado",
            description: "Tabela de cursos não encontrada. Execute o script database-setup.sql no Supabase primeiro.",
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

      console.log('Curso salvo com sucesso:', data);

      // Enviar email de confirmação
      try {
        console.log('Enviando email de confirmação do curso...');
        const emailResponse = await supabase.functions.invoke('send-curso-email', {
          body: {
            cursoData: {
              ...formData,
              cursoId: data[0].id
            }
          }
        });

        if (emailResponse.error) {
          console.error('Erro ao enviar email de curso:', emailResponse.error);
          toast({
            title: "Curso registrado!",
            description: "Curso cadastrado com sucesso, mas houve erro ao enviar o email de confirmação.",
            variant: "default"
          });
        } else {
          console.log('Email de curso enviado com sucesso');
        }
      } catch (emailError) {
        console.error('Erro no envio de email de curso:', emailError);
        toast({
          title: "Curso registrado!",
          description: "Curso cadastrado com sucesso, mas houve erro ao enviar o email de confirmação.",
          variant: "default"
        });
      }

      // Redirecionar para página de sucesso
      navigate('/curso-sucesso', {
        state: {
          nomeCompleto: formData.nome,
          cursoId: data[0].id,
          cursos: formData.cursos
        }
      });

    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Erro inesperado ao processar inscrição no curso. Tente novamente.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <img
        src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
        alt="PB Muscle Arena Logo"
        className="w-full h-auto max-w-xs mx-auto mb-8"
      />
      <Card className="shadow-card text-center">
        <CardContent className="p-8">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-destructive">Inscrições Encerradas</h1>
          <p className="text-muted-foreground mb-4">
            As inscrições para cursos foram encerradas.
          </p>
          <p className="text-red-600">
            Agradecemos o interesse e aguardem próximas edições!
          </p>
          <Button
            onClick={() => navigate('/')}
            className="mt-4"
            variant="outline"
          >
            Voltar ao início
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cursos;