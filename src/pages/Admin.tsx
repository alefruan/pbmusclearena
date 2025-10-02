import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { generatePDF } from '@/utils/pdfGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, X, FileText, Ticket, GraduationCap } from 'lucide-react';

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
}

interface IngressoData {
  id?: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
}

interface CursoData {
  id?: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
  curso: string;
}

const Admin: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [editingRegistration, setEditingRegistration] = useState<RegistrationData | null>(null);
  const [deletingRegistration, setDeletingRegistration] = useState<RegistrationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [regulamentoTexto, setRegulamentoTexto] = useState('');
  const [isRegulamentoModalOpen, setIsRegulamentoModalOpen] = useState(false);
  const [regulamentoLoading, setRegulamentoLoading] = useState(false);
  const [inscricoesAbertas, setInscricoesAbertas] = useState(true);
  const [inscricoesLoading, setInscricoesLoading] = useState(false);
  const [ingressosAbertos, setIngressosAbertos] = useState(true);
  const [ingressosLoading, setIngressosLoading] = useState(false);
  const [cursosAbertos, setCursosAbertos] = useState(true);
  const [cursosLoading, setCursosLoading] = useState(false);

  // Estados para ingressos
  const [ingressos, setIngressos] = useState<IngressoData[]>([]);
  const [editingIngresso, setEditingIngresso] = useState<IngressoData | null>(null);
  const [deletingIngresso, setDeletingIngresso] = useState<IngressoData | null>(null);
  const [isIngressoModalOpen, setIsIngressoModalOpen] = useState(false);
  const [isIngressoAlertOpen, setIsIngressoAlertOpen] = useState(false);
  const [ingressoSearchTerm, setIngressoSearchTerm] = useState('');
  const [showIngressos, setShowIngressos] = useState(false);

  // Estados para cursos
  const [cursos, setCursos] = useState<CursoData[]>([]);
  const [editingCurso, setEditingCurso] = useState<CursoData | null>(null);
  const [deletingCurso, setDeletingCurso] = useState<CursoData | null>(null);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
  const [isCursoAlertOpen, setIsCursoAlertOpen] = useState(false);
  const [cursoSearchTerm, setCursoSearchTerm] = useState('');
  const [showCursos, setShowCursos] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase.from('registrations').select('*');
      if (error) {
        console.error('Error fetching registrations:', error);
        if (error.code === 'PGRST116' || error.message.includes('relation "public.registrations" does not exist')) {
          alert('Tabela de registrations não encontrada. Execute o script database-setup.sql no Supabase primeiro.');
        }
      } else {
        setRegistrations(data as RegistrationData[]);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Erro inesperado ao buscar registrations. Verifique a conexão com o banco.');
    }
  };

  const fetchIngressos = async () => {
    try {
      console.log('Fazendo fetch dos ingressos...');
      const { data, error } = await supabase
        .from('ingressos')
        .select('*')
        .order('id', { ascending: true });

      console.log('Resultado fetch ingressos:', { data, error });

      if (error) {
        console.error('Error fetching ingressos:', error);
        if (error.code === 'PGRST116' || error.message.includes('relation "public.ingressos" does not exist')) {
          alert('Tabela de ingressos não encontrada. Execute o script database-setup.sql no Supabase primeiro.');
        }
      } else {
        console.log('Atualizando state dos ingressos com:', data);
        setIngressos(data as IngressoData[]);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Erro inesperado ao buscar ingressos. Verifique a conexão com o banco.');
    }
  };

  const fetchCursos = async () => {
    try {
      console.log('Fazendo fetch dos cursos...');
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .order('id', { ascending: true });

      console.log('Resultado fetch cursos:', { data, error });

      if (error) {
        console.error('Error fetching cursos:', error);
        if (error.code === 'PGRST116' || error.message.includes('relation "public.cursos" does not exist')) {
          alert('Tabela de cursos não encontrada. Execute o script database-setup.sql no Supabase primeiro.');
        }
      } else {
        console.log('Atualizando state dos cursos com:', data);
        setCursos(data as CursoData[]);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Erro inesperado ao buscar cursos. Verifique a conexão com o banco.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchRegistrations();
      await fetchRegulamento();
      await fetchInscricoesStatus();
      await fetchIngressosStatus();
      await fetchCursosStatus();
      await fetchIngressos(); // Sempre carregar ingressos para mostrar o contador
      await fetchCursos(); // Sempre carregar cursos para mostrar o contador
    };
    loadData();
  }, []);

  const fetchRegulamento = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'regulamento')
        .single();

      if (error) {
        console.error('Error fetching regulation:', error);
        if (error.code === 'PGRST116' || error.message.includes('relation "public.settings" does not exist')) {
          console.warn('Tabela settings não encontrada. Usando regulamento padrão.');
        }
        setRegulamentoTexto(getDefaultRegulamento());
      } else {
        setRegulamentoTexto(data?.value || getDefaultRegulamento());
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setRegulamentoTexto(getDefaultRegulamento());
    }
  };

  const getDefaultRegulamento = () => {
    return `REGULAMENTO DO EVENTO DE FISICULTURISMO - PB MUSCLE ARENA

1. DISPOSIÇÕES GERAIS
1.1. O presente regulamento tem por objetivo estabelecer as regras e condições para participação no evento de fisiculturismo promovido pela PB MUSCLE ARENA.
1.2. A participação no evento implica na aceitação integral deste regulamento.

2. INSCRIÇÕES
2.1. As inscrições deverão ser realizadas exclusivamente através do sistema online disponibilizado.
2.2. O participante deverá preencher corretamente todos os dados solicitados no formulário de inscrição.

3. CATEGORIAS
3.1. CATEGORIAS FEMININAS: BIKINI, FIGURE, WOMEN'S PHYSIQUE, WELLNESS
3.2. CATEGORIAS MASCULINAS: BODYSHAPE, ESPECIAL, BODYBUILDING, CLASSIC PHYSIQUE, MEN'S PHYSIQUE

4. RESPONSABILIDADES
4.1. A organização não se responsabiliza por objetos perdidos ou danificados durante o evento.
4.2. Cada participante é responsável por sua própria saúde e condicionamento físico.

PB MUSCLE ARENA - © 2024 - Todos os direitos reservados`;
  };

  const fetchInscricoesStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'inscricoes_abertas')
        .single();

      if (error) {
        console.error('Error fetching inscricoes status:', error);
        if (error.code === 'PGRST116' || error.message.includes('relation "public.settings" does not exist')) {
          console.warn('Tabela settings não encontrada. Mantendo inscrições abertas por padrão.');
        }
        setInscricoesAbertas(true);
      } else {
        setInscricoesAbertas(data?.value === 'true');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setInscricoesAbertas(true);
    }
  };

  const fetchIngressosStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'ingressos_abertos')
        .single();

      if (error) {
        console.error('Error fetching ingressos status:', error);
        if (error.code === 'PGRST116' || error.message.includes('relation "public.settings" does not exist')) {
          console.warn('Tabela settings não encontrada. Mantendo ingressos abertos por padrão.');
        }
        setIngressosAbertos(true);
      } else {
        setIngressosAbertos(data?.value === 'true');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setIngressosAbertos(true);
    }
  };

  const fetchCursosStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'cursos_abertos')
        .single();

      if (error) {
        console.error('Error fetching cursos status:', error);
        if (error.code === 'PGRST116' || error.message.includes('relation "public.settings" does not exist')) {
          console.warn('Tabela settings não encontrada. Mantendo cursos abertos por padrão.');
        }
        setCursosAbertos(true);
      } else {
        setCursosAbertos(data?.value === 'true');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setCursosAbertos(true);
    }
  };

  const handleInscricoesToggle = async (checked: boolean) => {
    setInscricoesLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert([{ key: 'inscricoes_abertas', value: checked.toString() }], {
          onConflict: 'key'
        });

      if (error) {
        console.error('Error saving inscricoes status:', error);
        if (error.message.includes('relation "public.settings" does not exist')) {
          alert('Tabela settings não encontrada. Execute o script database-setup.sql no Supabase primeiro.');
        } else {
          alert('Erro ao salvar o status das inscrições: ' + error.message);
        }
      } else {
        setInscricoesAbertas(checked);
        alert(`Inscrições ${checked ? 'abertas' : 'fechadas'} com sucesso!`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro inesperado ao salvar o status das inscrições. Verifique a conexão com o banco.');
    } finally {
      setInscricoesLoading(false);
    }
  };

  const handleIngressosToggle = async (checked: boolean) => {
    setIngressosLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert([{ key: 'ingressos_abertos', value: checked.toString() }], {
          onConflict: 'key'
        });

      if (error) {
        console.error('Error saving ingressos status:', error);
        if (error.message.includes('relation "public.settings" does not exist')) {
          alert('Tabela settings não encontrada. Execute o script database-setup.sql no Supabase primeiro.');
        } else {
          alert('Erro ao salvar o status dos ingressos: ' + error.message);
        }
      } else {
        setIngressosAbertos(checked);
        alert(`Ingressos ${checked ? 'abertos' : 'fechados'} com sucesso!`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro inesperado ao salvar o status dos ingressos. Verifique a conexão com o banco.');
    } finally {
      setIngressosLoading(false);
    }
  };

  const handleCursosToggle = async (checked: boolean) => {
    setCursosLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert([{ key: 'cursos_abertos', value: checked.toString() }], {
          onConflict: 'key'
        });

      if (error) {
        console.error('Error saving cursos status:', error);
        if (error.message.includes('relation "public.settings" does not exist')) {
          alert('Tabela settings não encontrada. Execute o script database-setup.sql no Supabase primeiro.');
        } else {
          alert('Erro ao salvar o status dos cursos: ' + error.message);
        }
      } else {
        setCursosAbertos(checked);
        alert(`Cursos ${checked ? 'abertos' : 'fechados'} com sucesso!`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro inesperado ao salvar o status dos cursos. Verifique a conexão com o banco.');
    } finally {
      setCursosLoading(false);
    }
  };

  const handleRegulamentoEdit = () => {
    setIsRegulamentoModalOpen(true);
  };

  const handleRegulamentoSave = async () => {
    setRegulamentoLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert([{ key: 'regulamento', value: regulamentoTexto }], {
          onConflict: 'key'
        });

      if (error) {
        console.error('Error saving regulation:', error);
        if (error.message.includes('relation "public.settings" does not exist')) {
          alert('Tabela settings não encontrada. Execute o script database-setup.sql no Supabase primeiro.');
        } else {
          alert('Erro ao salvar o regulamento: ' + error.message);
        }
      } else {
        alert('Regulamento salvo com sucesso!');
        setIsRegulamentoModalOpen(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro inesperado ao salvar o regulamento. Verifique a conexão com o banco.');
    } finally {
      setRegulamentoLoading(false);
    }
  };

  const handleEditClick = (registration: RegistrationData) => {
    setEditingRegistration(registration);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingRegistration) return;

    const { error } = await supabase
      .from('registrations')
      .update(editingRegistration)
      .eq('id', editingRegistration.id);

    if (error) {
      console.error('Error updating registration:', error);
    } else {
      setIsModalOpen(false);
      setEditingRegistration(null);
      fetchRegistrations(); // Refresh the list
    }
  };

  const handleDeleteClick = (registration: RegistrationData) => {
    setDeletingRegistration(registration);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRegistration) return;

    try {
      console.log('Tentando deletar inscrição:', deletingRegistration);
      console.log('ID da inscrição (tipo):', typeof deletingRegistration.id, deletingRegistration.id);

      // Primeiro, vamos verificar se o registro existe
      const { data: existingData, error: selectError } = await supabase
        .from('registrations')
        .select('*')
        .eq('id', deletingRegistration.id);

      console.log('Verificação de existência:', { existingData, selectError });

      if (selectError) {
        console.error('Erro ao verificar existência:', selectError);
        return;
      }

      if (!existingData || existingData.length === 0) {
        console.log('Registro não encontrado para deletar');
        // Remove da interface mesmo que não esteja no banco
        setIsAlertOpen(false);
        setDeletingRegistration(null);
        await fetchRegistrations();
        return;
      }

      // Tenta deletar convertendo o ID para número
      const { data, error, count } = await supabase
        .from('registrations')
        .delete()
        .eq('id', Number(deletingRegistration.id))
        .select();

      console.log('Resultado do delete:', { data, error, count });

      if (error) {
        console.error('Error deleting registration:', error);
        return;
      }

      console.log('Inscrição deletada com sucesso!');
      setIsAlertOpen(false);
      setDeletingRegistration(null);

      // Pequeno delay para garantir que o banco processou a exclusão
      setTimeout(async () => {
        await fetchRegistrations();
      }, 100);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  // Funções para ingressos
  const handleIngressoEditClick = (ingresso: IngressoData) => {
    setEditingIngresso(ingresso);
    setIsIngressoModalOpen(true);
  };

  const handleIngressoUpdate = async () => {
    if (!editingIngresso) return;

    const { error } = await supabase
      .from('ingressos')
      .update(editingIngresso)
      .eq('id', editingIngresso.id);

    if (error) {
      console.error('Error updating ingresso:', error);
    } else {
      setIsIngressoModalOpen(false);
      setEditingIngresso(null);
      fetchIngressos();
    }
  };

  const handleIngressoDeleteClick = (ingresso: IngressoData) => {
    setDeletingIngresso(ingresso);
    setIsIngressoAlertOpen(true);
  };

  const handleIngressoDeleteConfirm = async () => {
    if (!deletingIngresso) return;

    try {
      console.log('Tentando deletar ingresso:', deletingIngresso);
      console.log('ID do ingresso (tipo):', typeof deletingIngresso.id, deletingIngresso.id);

      // Primeiro, vamos verificar se o registro existe
      const { data: existingData, error: selectError } = await supabase
        .from('ingressos')
        .select('*')
        .eq('id', deletingIngresso.id);

      console.log('Verificação de existência:', { existingData, selectError });

      if (selectError) {
        console.error('Erro ao verificar existência:', selectError);
        return;
      }

      if (!existingData || existingData.length === 0) {
        console.log('Registro não encontrado para deletar');
        // Remove da interface mesmo que não esteja no banco
        setIsIngressoAlertOpen(false);
        setDeletingIngresso(null);
        await fetchIngressos();
        return;
      }

      // Tenta deletar convertendo o ID para número
      const { data, error, count } = await supabase
        .from('ingressos')
        .delete()
        .eq('id', Number(deletingIngresso.id))
        .select();

      console.log('Resultado do delete:', { data, error, count });

      if (error) {
        console.error('Error deleting ingresso:', error);
        return;
      }

      console.log('Ingresso deletado com sucesso!');
      setIsIngressoAlertOpen(false);
      setDeletingIngresso(null);

      // Pequeno delay para garantir que o banco processou a exclusão
      setTimeout(async () => {
        await fetchIngressos();
      }, 100);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const filteredRegistrations = registrations.filter(
    (registration) =>
      registration.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.cpf.includes(searchTerm)
  );

  // Funções para cursos
  const handleCursoEditClick = (curso: CursoData) => {
    setEditingCurso(curso);
    setIsCursoModalOpen(true);
  };

  const handleCursoUpdate = async () => {
    if (!editingCurso) return;

    const { error } = await supabase
      .from('cursos')
      .update(editingCurso)
      .eq('id', editingCurso.id);

    if (error) {
      console.error('Error updating curso:', error);
    } else {
      setIsCursoModalOpen(false);
      setEditingCurso(null);
      fetchCursos();
    }
  };

  const handleCursoDeleteClick = (curso: CursoData) => {
    setDeletingCurso(curso);
    setIsCursoAlertOpen(true);
  };

  const handleCursoDeleteConfirm = async () => {
    if (!deletingCurso) return;

    try {
      console.log('Tentando deletar curso:', deletingCurso);
      console.log('ID do curso (tipo):', typeof deletingCurso.id, deletingCurso.id);

      // Primeiro, vamos verificar se o registro existe
      const { data: existingData, error: selectError } = await supabase
        .from('cursos')
        .select('*')
        .eq('id', deletingCurso.id);

      console.log('Verificação de existência:', { existingData, selectError });

      if (selectError) {
        console.error('Erro ao verificar existência:', selectError);
        return;
      }

      if (!existingData || existingData.length === 0) {
        console.log('Registro não encontrado para deletar');
        // Remove da interface mesmo que não esteja no banco
        setIsCursoAlertOpen(false);
        setDeletingCurso(null);
        await fetchCursos();
        return;
      }

      // Tenta deletar convertendo o ID para número
      const { data, error, count } = await supabase
        .from('cursos')
        .delete()
        .eq('id', Number(deletingCurso.id))
        .select();

      console.log('Resultado do delete:', { data, error, count });

      if (error) {
        console.error('Error deleting curso:', error);
        return;
      }

      console.log('Curso deletado com sucesso!');
      setIsCursoAlertOpen(false);
      setDeletingCurso(null);

      // Pequeno delay para garantir que o banco processou a exclusão
      setTimeout(async () => {
        await fetchCursos();
      }, 100);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const filteredIngressos = ingressos.filter(
    (ingresso) =>
      ingresso.nome.toLowerCase().includes(ingressoSearchTerm.toLowerCase()) ||
      ingresso.cpf.includes(ingressoSearchTerm)
  );

  const filteredCursos = cursos.filter(
    (curso) =>
      curso.nome.toLowerCase().includes(cursoSearchTerm.toLowerCase()) ||
      curso.cpf.includes(cursoSearchTerm)
  );

  return (
    <div className="container mx-auto p-4">
      <img
        src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
        alt="PB Muscle Arena Logo"
        className="w-full h-auto max-w-xs mx-auto mb-8"
      />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setShowIngressos(false);
              setShowCursos(!showCursos);
            }}
            variant="outline"
            className={showCursos ? 'bg-green-100 text-green-800 border-green-300' : ''}
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            {showCursos ? 'Ver Inscrições' : 'Ver Cursos'}
          </Button>
          <Button
            onClick={() => {
              setShowCursos(false);
              setShowIngressos(!showIngressos);
            }}
            variant="outline"
            className={showIngressos ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}
          >
            <Ticket className="h-4 w-4 mr-2" />
            {showIngressos ? 'Ver Inscrições' : 'Ver Ingressos'}
          </Button>
          <Button onClick={handleRegulamentoEdit} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Editar Regulamento
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        {/* Status das Inscrições */}
        <div className="p-4 bg-card rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Status das Inscrições</h3>
              <p className="text-sm text-muted-foreground">
                {inscricoesAbertas ? 'As inscrições estão abertas' : 'As inscrições estão fechadas'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Fechado</span>
              <Switch
                checked={inscricoesAbertas}
                onCheckedChange={handleInscricoesToggle}
                disabled={inscricoesLoading}
              />
              <span className="text-sm">Aberto</span>
            </div>
          </div>
        </div>

        {/* Status dos Ingressos */}
        <div className="p-4 bg-card rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Status dos Ingressos</h3>
              <p className="text-sm text-muted-foreground">
                {ingressosAbertos ? 'Os ingressos estão abertos' : 'Os ingressos estão fechados'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Fechado</span>
              <Switch
                checked={ingressosAbertos}
                onCheckedChange={handleIngressosToggle}
                disabled={ingressosLoading}
              />
              <span className="text-sm">Aberto</span>
            </div>
          </div>
        </div>

        {/* Status dos Cursos */}
        <div className="p-4 bg-card rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Status dos Cursos</h3>
              <p className="text-sm text-muted-foreground">
                {cursosAbertos ? 'Os cursos estão abertos' : 'Os cursos estão fechados'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Fechado</span>
              <Switch
                checked={cursosAbertos}
                onCheckedChange={handleCursosToggle}
                disabled={cursosLoading}
              />
              <span className="text-sm">Aberto</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <Input
          placeholder={
            showCursos ? "Buscar curso por nome ou CPF..." :
            showIngressos ? "Buscar ingresso por nome ou CPF..." :
            "Buscar inscrição por nome ou CPF..."
          }
          value={
            showCursos ? cursoSearchTerm :
            showIngressos ? ingressoSearchTerm :
            searchTerm
          }
          onChange={(e) => {
            if (showCursos) {
              setCursoSearchTerm(e.target.value);
            } else if (showIngressos) {
              setIngressoSearchTerm(e.target.value);
            } else {
              setSearchTerm(e.target.value);
            }
          }}
          className="max-w-sm"
        />
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">Total de inscrições:</span>
            <span className="bg-gray-100 text-black px-2 py-1 rounded-md font-semibold">
              {registrations.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Total de ingressos:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-semibold">
              {ingressos.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Total de cursos:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-semibold">
              {cursos.length}
            </span>
          </div>
        </div>
      </div>

      {/* Seção de Inscrições */}
      {!showIngressos && !showCursos && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Nome</th>
                <th className="py-2 px-4 border-b">CPF</th>
                <th className="py-2 px-4 border-b">Telefone</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id}>
                  <td className="py-2 px-4 border-b">{registration.nome}</td>
                  <td className="py-2 px-4 border-b">{registration.cpf}</td>
                  <td className="py-2 px-4 border-b">{registration.telefone}</td>
                  <td className="py-2 px-4 border-b">{registration.email}</td>
                  <td className="py-2 px-4 border-b">
                    <Button onClick={() => generatePDF(registration)}>Gerar PDF</Button>
                    <Button onClick={() => handleEditClick(registration)} className="ml-2">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDeleteClick(registration)} className="ml-2" variant="destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Seção de Ingressos */}
      {showIngressos && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nome</th>
                <th className="py-2 px-4 border-b">CPF</th>
                <th className="py-2 px-4 border-b">Telefone</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Cidade/UF</th>
                <th className="py-2 px-4 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngressos.map((ingresso) => (
                <tr key={ingresso.id}>
                  <td className="py-2 px-4 border-b">#{String(ingresso.id).padStart(6, '0')}</td>
                  <td className="py-2 px-4 border-b">{ingresso.nome}</td>
                  <td className="py-2 px-4 border-b">{ingresso.cpf}</td>
                  <td className="py-2 px-4 border-b">{ingresso.telefone}</td>
                  <td className="py-2 px-4 border-b">{ingresso.email}</td>
                  <td className="py-2 px-4 border-b">{ingresso.cidade}/{ingresso.uf}</td>
                  <td className="py-2 px-4 border-b">
                    <Button onClick={() => handleIngressoEditClick(ingresso)} className="mr-2">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleIngressoDeleteClick(ingresso)} variant="destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Seção de Cursos */}
      {showCursos && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nome</th>
                <th className="py-2 px-4 border-b">CPF</th>
                <th className="py-2 px-4 border-b">Telefone</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Cidade/UF</th>
                <th className="py-2 px-4 border-b">Curso</th>
                <th className="py-2 px-4 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCursos.map((curso) => (
                <tr key={curso.id}>
                  <td className="py-2 px-4 border-b">#{String(curso.id).padStart(6, '0')}</td>
                  <td className="py-2 px-4 border-b">{curso.nome}</td>
                  <td className="py-2 px-4 border-b">{curso.cpf}</td>
                  <td className="py-2 px-4 border-b">{curso.telefone}</td>
                  <td className="py-2 px-4 border-b">{curso.email}</td>
                  <td className="py-2 px-4 border-b">{curso.cidade}/{curso.uf}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex flex-wrap gap-1">
                      {typeof curso.curso === 'string' && curso.curso.includes(',')
                        ? curso.curso.split(',').map((c, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                              {c.trim()}
                            </span>
                          ))
                        : (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                              {curso.curso}
                            </span>
                          )
                      }
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Button onClick={() => handleCursoEditClick(curso)} className="mr-2">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleCursoDeleteClick(curso)} variant="destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingRegistration && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Inscrição</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.keys(editingRegistration).map((key) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor={key} className="text-right">
                    {key}
                  </label>
                  <input
                    id={key}
                    value={editingRegistration[key as keyof RegistrationData]?.toString() || ''}
                    onChange={(e) =>
                      setEditingRegistration({
                        ...editingRegistration,
                        [key]: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleUpdate}>Salvar</Button>
          </DialogContent>
        </Dialog>
      )}

      {deletingRegistration && (
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Isso irá deletar permanentemente a inscrição de {
                  deletingRegistration.nome
                }.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Modal para editar regulamento */}
      <Dialog open={isRegulamentoModalOpen} onOpenChange={setIsRegulamentoModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Regulamento do Evento</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <Textarea
              value={regulamentoTexto}
              onChange={(e) => setRegulamentoTexto(e.target.value)}
              placeholder="Digite o texto do regulamento..."
              className="h-full min-h-[400px] resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsRegulamentoModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRegulamentoSave} disabled={regulamentoLoading}>
              {regulamentoLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modais para Ingressos */}
      {editingIngresso && (
        <Dialog open={isIngressoModalOpen} onOpenChange={setIsIngressoModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Ingresso</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.keys(editingIngresso).map((key) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor={key} className="text-right">
                    {key}
                  </label>
                  <input
                    id={key}
                    value={editingIngresso[key as keyof IngressoData]?.toString() || ''}
                    onChange={(e) =>
                      setEditingIngresso({
                        ...editingIngresso,
                        [key]: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleIngressoUpdate}>Salvar</Button>
          </DialogContent>
        </Dialog>
      )}

      {deletingIngresso && (
        <AlertDialog open={isIngressoAlertOpen} onOpenChange={setIsIngressoAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Isso irá deletar permanentemente o ingresso de {
                  deletingIngresso.nome
                }.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleIngressoDeleteConfirm}>Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Modais para Cursos */}
      {editingCurso && (
        <Dialog open={isCursoModalOpen} onOpenChange={setIsCursoModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Curso</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.keys(editingCurso).map((key) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor={key} className="text-right">
                    {key}
                  </label>
                  <input
                    id={key}
                    value={editingCurso[key as keyof CursoData]?.toString() || ''}
                    onChange={(e) =>
                      setEditingCurso({
                        ...editingCurso,
                        [key]: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleCursoUpdate}>Salvar</Button>
          </DialogContent>
        </Dialog>
      )}

      {deletingCurso && (
        <AlertDialog open={isCursoAlertOpen} onOpenChange={setIsCursoAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Isso irá deletar permanentemente a inscrição no curso de {
                  deletingCurso.nome
                }.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleCursoDeleteConfirm}>Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Admin;