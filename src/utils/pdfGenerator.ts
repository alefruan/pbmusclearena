import jsPDF from 'jspdf';

interface RegistrationData {
  nome: string;
  cpf: string;
  rg: string;
  idade: string;
  endereco: string;
  cidade: string;
  uf: string;
  telefone: string;
  email: string;
  altura: string;
  peso: string;
  dobra: boolean;
  pintura: boolean;
  foto: boolean;
  genero: 'feminino' | 'masculino';
  categoria: string;
  subcategoria: string;
}

export const generatePDF = async (data: RegistrationData): Promise<void> => {
  const pdf = new jsPDF();
  
  // Configurações de fonte e cores
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  
  // Cabeçalho
  pdf.setTextColor(220, 94, 40); // Cor laranja do tema
  pdf.text('FORMULÁRIO DE INSCRIÇÃO', 105, 20, { align: 'center' });
  pdf.text('NORDESTE LEGENDS', 105, 30, { align: 'center' });
  
  // Linha decorativa
  pdf.setDrawColor(220, 94, 40);
  pdf.setLineWidth(0.5);
  pdf.line(20, 35, 190, 35);
  
  // Texto de autorização
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);
  const authText = "No ato de inscrição, e para todos os fins de direito, o atleta autoriza à Nordeste Legends e aos fotógrafos do evento o uso de sua imagem para fins de divulgação de todo e qualquer item relacionado à Nordeste Legends, sendo esta uma expressão de sua própria vontade, e nada terá a reclamar a título de direitos relacionados à sua voz e imagem pela Nordeste Legends.";
  const splitText = pdf.splitTextToSize(authText, 170);
  pdf.text(splitText, 20, 45);
  
  let yPosition = 60;
  
  // Seção Identificação
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(220, 94, 40);
  pdf.text('IDENTIFICAÇÃO', 20, yPosition);
  
  yPosition += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  // Campos de identificação
  const idFields = [
    { label: 'Nome:', value: data.nome },
    { label: 'CPF:', value: data.cpf },
    { label: 'RG:', value: data.rg },
    { label: 'Idade:', value: data.idade },
    { label: 'Endereço:', value: data.endereco },
    { label: 'Cidade:', value: data.cidade },
    { label: 'UF:', value: data.uf },
    { label: 'Telefone:', value: data.telefone },
    { label: 'E-mail:', value: data.email }
  ];
  
  idFields.forEach(field => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(field.label, 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(field.value || '_________________', 45, yPosition);
    yPosition += 8;
  });
  
  yPosition += 10;
  
  // Seção Pesagem e Medições
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(220, 94, 40);
  pdf.text('PESAGEM E MEDIÇÕES', 20, yPosition);
  pdf.setFontSize(9);
  pdf.text('(Preenchimento pelo Árbitro da pesagem)', 20, yPosition + 8);
  
  yPosition += 20;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  // Campos de medição
  const measureFields = [
    { label: 'ALTURA:', value: data.altura },
    { label: 'PESO:', value: data.peso },
    { label: 'IDADE:', value: data.idade }
  ];
  
  measureFields.forEach(field => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(field.label, 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(field.value || '_________________', 45, yPosition);
    yPosition += 8;
  });
  
  // Checkboxes
  yPosition += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.text('DOBRA: ', 20, yPosition);
  pdf.rect(50, yPosition - 3, 4, 4);
  if (data.dobra) pdf.text('X', 51, yPosition);
  pdf.text(' SIM', 56, yPosition);
  pdf.rect(75, yPosition - 3, 4, 4);
  if (!data.dobra) pdf.text('X', 76, yPosition);
  pdf.text(' NÃO', 81, yPosition);
  
  yPosition += 8;
  pdf.text('PINTURA: ', 20, yPosition);
  pdf.rect(50, yPosition - 3, 4, 4);
  if (data.pintura) pdf.text('X', 51, yPosition);
  pdf.text(' SIM', 56, yPosition);
  pdf.rect(75, yPosition - 3, 4, 4);
  if (!data.pintura) pdf.text('X', 76, yPosition);
  pdf.text(' NÃO', 81, yPosition);
  
  yPosition += 8;
  pdf.text('FOTO: ', 20, yPosition);
  pdf.rect(50, yPosition - 3, 4, 4);
  if (data.foto) pdf.text('X', 51, yPosition);
  pdf.text(' SIM', 56, yPosition);
  pdf.rect(75, yPosition - 3, 4, 4);
  if (!data.foto) pdf.text('X', 76, yPosition);
  pdf.text(' NÃO', 81, yPosition);
  
  yPosition += 20;
  
  // Seção Categorias
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(220, 94, 40);
  pdf.text('CATEGORIAS', 20, yPosition);
  
  yPosition += 15;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  // Tabela de categorias femininas
  pdf.setFont('helvetica', 'bold');
  pdf.text('FEMININAS', 20, yPosition);
  yPosition += 8;
  
  const femCategories = ['BIKINI', 'FIGURE', 'WOMEN\'S PHYSIQUE', 'WELLNESS'];
  const subCategories = ['TEEN', 'ESTREANT.', 'NOVICE', 'OPEN', 'MASTER', 'CLASSE ESPECIAL'];
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  
  // Desenhar tabela feminina
  let xPos = 20;
  femCategories.forEach(cat => {
    pdf.rect(xPos, yPosition - 3, 25, 6);
    pdf.text(cat, xPos + 1, yPosition);
    if (data.genero === 'feminino' && data.categoria === cat) {
      pdf.text('X', xPos + 22, yPosition);
    }
    xPos += 25;
  });
  
  yPosition += 10;
  
  // Subcategorias femininas
  xPos = 20;
  subCategories.forEach(sub => {
    pdf.rect(xPos, yPosition - 3, 25, 6);
    pdf.text(sub, xPos + 1, yPosition);
    if (data.genero === 'feminino' && data.subcategoria === sub) {
      pdf.text('X', xPos + 22, yPosition);
    }
    xPos += 25;
  });
  
  yPosition += 15;
  
  // Tabela de categorias masculinas
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('MASCULINAS', 20, yPosition);
  yPosition += 8;
  
  const mascCategories = ['BODYSHAPE', 'ESPECIAL', 'BODYBUILDING', 'CLASSIC PHYSIQUE', 'MEN\'S PHYSIQUE'];
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  
  // Desenhar tabela masculina
  xPos = 20;
  mascCategories.forEach(cat => {
    pdf.rect(xPos, yPosition - 3, 25, 6);
    pdf.text(cat, xPos + 1, yPosition);
    if (data.genero === 'masculino' && data.categoria === cat) {
      pdf.text('X', xPos + 22, yPosition);
    }
    xPos += 25;
  });
  
  yPosition += 10;
  
  // Subcategorias masculinas
  xPos = 20;
  subCategories.forEach(sub => {
    pdf.rect(xPos, yPosition - 3, 25, 6);
    pdf.text(sub, xPos + 1, yPosition);
    if (data.genero === 'masculino' && data.subcategoria === sub) {
      pdf.text('X', xPos + 22, yPosition);
    }
    xPos += 25;
  });
  
  // Seção de assinaturas
  yPosition += 25;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('ASSINATURA DO ÁRBITRO RESPONSÁVEL PELA VERIFICAÇÃO:', 20, yPosition);
  
  yPosition += 15;
  pdf.setFont('helvetica', 'normal');
  pdf.text('Local: ________________, ______ de _______________ de 2024', 20, yPosition);
  
  yPosition += 15;
  pdf.line(20, yPosition, 90, yPosition);
  pdf.text('Assinatura', 20, yPosition + 8);
  
  pdf.line(120, yPosition, 190, yPosition);
  pdf.text('Assinatura do responsável para menores de 18 anos', 120, yPosition + 8);
  
  // Salvar o PDF
  const fileName = `inscricao_${data.nome.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`;
  pdf.save(fileName);
};