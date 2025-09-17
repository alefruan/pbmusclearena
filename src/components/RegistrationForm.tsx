import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfGenerator';

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
    altura: '',
    peso: '',
    pintura: false,
    foto: false,
    genero: 'masculino',
    categoria: '',
    subcategoria: ''
  });

  const handleInputChange = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.cpf || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.from('registrations').insert([formData]).select();

      if (error) {
        throw error;
      }

      await generatePDF(formData);
      toast({
        title: "Inscrição realizada!",
        description: "PDF gerado com sucesso. Verifique os downloads.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar os dados ou gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const categorias = formData.genero === 'feminino' ? CATEGORIAS_FEMININAS : CATEGORIAS_MASCULINAS;

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
              <Label htmlFor="rg" className="text-sm font-medium">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => handleInputChange('rg', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="idade" className="text-sm font-medium">Idade</Label>
              <Input
                id="idade"
                type="number"
                value={formData.idade}
                onChange={(e) => handleInputChange('idade', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="endereco" className="text-sm font-medium">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cidade" className="text-sm font-medium">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="uf" className="text-sm font-medium">UF</Label>
              <Input
                id="uf"
                value={formData.uf}
                onChange={(e) => handleInputChange('uf', e.target.value)}
                className="mt-1"
                maxLength={2}
              />
            </div>
            <div>
              <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className="mt-1"
                placeholder="(00) 00000-0000"
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