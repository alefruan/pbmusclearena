import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { generatePDF } from '@/utils/pdfGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Pencil, X } from 'lucide-react';

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
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const fetchRegistrations = async () => {
    const { data, error } = await supabase.from('registrations').select('*');
    if (error) {
      console.error('Error fetching registrations:', error);
    } else {
      setRegistrations(data as RegistrationData[]);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

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
        <Button onClick={handleLogout}>Logout</Button>
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
              <th className="py-2 px-4 border-b">Categoria</th>
              <th className="py-2 px-4 border-b">Subcategoria</th>
              <th className="py-2 px-4 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((registration) => (
              <tr key={registration.id}>
                <td className="py-2 px-4 border-b">{registration.nome}</td>
                <td className="py-2 px-4 border-b">{registration.cpf}</td>
                <td className="py-2 px-4 border-b">{registration.categoria}</td>
                <td className="py-2 px-4 border-b">{registration.subcategoria}</td>
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
    </div>
  );
};

export default Admin;