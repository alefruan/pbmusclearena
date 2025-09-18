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
import { Pencil, X, FileText } from 'lucide-react';

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

  useEffect(() => {
    fetchRegistrations();
    fetchRegulamento();
    fetchInscricoesStatus();
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

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', deletingRegistration.id);

    if (error) {
      console.error('Error deleting registration:', error);
    } else {
      setIsAlertOpen(false);
      setDeletingRegistration(null);
      fetchRegistrations(); // Refresh the list
    }
  };

  const filteredRegistrations = registrations.filter(
    (registration) =>
      registration.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.cpf.includes(searchTerm)
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
          <Button onClick={handleRegulamentoEdit} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Editar Regulamento
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-card rounded-lg border">
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
      <div className="mb-4">
        <Input
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
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
    </div>
  );
};

export default Admin;