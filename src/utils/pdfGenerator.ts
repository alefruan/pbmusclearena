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
  pintura: boolean;
  foto: boolean;
  genero: 'feminino' | 'masculino';
  categoria: string;
  subcategoria: string;
}

export const generatePDF = async (data: RegistrationData): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 10;

  // Número do formulário no canto superior direito
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('Nº', pageWidth - 35, 15);
  pdf.rect(pageWidth - 25, 10, 20, 8);

  // Cabeçalho principal
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('FORMULÁRIO DE INSCRIÇÃO', pageWidth / 2, 25, { align: 'center' });

  // Texto de autorização
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  let yPos = 35;
  const authText = "No ato de inscrição, e para todos os fins de direito, o atleta autoriza à Nordeste Legends e aos fotógrafos do evento o uso de sua imagem para fins de divulgação de todo e qualquer item relacionado à Nordeste Legends, sendo esta uma expressão de sua própria vontade, e nada terá a reclamar a título de direitos relacionados à sua voz e imagem pela Nordeste Legends.";
  const splitText = pdf.splitTextToSize(authText, pageWidth - 20);
  pdf.text(splitText, margin, yPos);

  yPos += 20;
  
  // Seção IDENTIFICAÇÃO
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setFillColor(200, 200, 200);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 6, 'F');
  pdf.text('IDENTIFICAÇÃO', pageWidth / 2, yPos + 4, { align: 'center' });

  yPos += 6;

  // Tabela de identificação
  const tableStartY = yPos;
  const rowHeight = 6;

  // Linha 1: Nome
  pdf.setFillColor(255, 255, 255);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, rowHeight);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('Nome:', margin + 2, yPos + 4);
  pdf.setFont('helvetica', 'normal');
  if (data.nome) {
    pdf.text(data.nome, margin + 25, yPos + 4);
  }

  yPos += rowHeight;

  // Linha 2: CPF, RG, Idade
  pdf.rect(margin, yPos, 60, rowHeight);
  pdf.rect(margin + 60, yPos, 60, rowHeight);
  pdf.rect(margin + 120, yPos, pageWidth - 2 * margin - 120, rowHeight);

  pdf.setFont('helvetica', 'bold');
  pdf.text('CPF:', margin + 2, yPos + 4);
  pdf.text('RG:', margin + 62, yPos + 4);
  pdf.text('Idade:', margin + 122, yPos + 4);

  pdf.setFont('helvetica', 'normal');
  if (data.cpf) pdf.text(data.cpf, margin + 20, yPos + 4);
  if (data.rg) pdf.text(data.rg, margin + 78, yPos + 4);
  if (data.idade) pdf.text(data.idade, margin + 145, yPos + 4);

  yPos += rowHeight;

  // Linha 3: Endereço
  pdf.rect(margin, yPos, pageWidth - 2 * margin, rowHeight);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Endereço:', margin + 2, yPos + 4);
  pdf.setFont('helvetica', 'normal');
  if (data.endereco) pdf.text(data.endereco, margin + 35, yPos + 4);

  yPos += rowHeight;

  // Linha 4: Cidade, UF, Telefone
  pdf.rect(margin, yPos, 80, rowHeight);
  pdf.rect(margin + 80, yPos, 30, rowHeight);
  pdf.rect(margin + 110, yPos, pageWidth - 2 * margin - 110, rowHeight);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Cidade:', margin + 2, yPos + 4);
  pdf.text('UF:', margin + 82, yPos + 4);
  pdf.text('Telefone:', margin + 112, yPos + 4);

  pdf.setFont('helvetica', 'normal');
  if (data.cidade) pdf.text(data.cidade, margin + 28, yPos + 4);
  if (data.uf) pdf.text(data.uf, margin + 95, yPos + 4);
  if (data.telefone) pdf.text(data.telefone, margin + 145, yPos + 4);

  yPos += rowHeight;

  // Linha 5: E-mail
  pdf.rect(margin, yPos, pageWidth - 2 * margin, rowHeight);
  pdf.setFont('helvetica', 'bold');
  pdf.text('E-mail:', margin + 2, yPos + 4);
  pdf.setFont('helvetica', 'normal');
  if (data.email) pdf.text(data.email, margin + 28, yPos + 4);

  yPos += rowHeight + 2;
  
  // Seção PESAGEM E MEDIÇÕES
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setFillColor(200, 200, 200);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 6, 'F');
  pdf.text('PESAGEM E MEDIÇÕES', pageWidth / 2, yPos + 4, { align: 'center' });

  yPos += 6;

  // Subtítulo
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('(Preenchimento pelo Árbitro da pesagem)', pageWidth / 2, yPos + 5, { align: 'center' });

  yPos += 8;

  // Linha com ALTURA, PESO, IDADE
  const measureRowHeight = 6;
  const col1Width = 60;
  const col2Width = 60;
  const col3Width = pageWidth - 2 * margin - col1Width - col2Width;

  pdf.rect(margin, yPos, col1Width, measureRowHeight);
  pdf.rect(margin + col1Width, yPos, col2Width, measureRowHeight);
  pdf.rect(margin + col1Width + col2Width, yPos, col3Width, measureRowHeight);

  pdf.setFont('helvetica', 'bold');
  pdf.text('ALTURA:', margin + 2, yPos + 4);
  pdf.text('PESO:', margin + col1Width + 2, yPos + 4);
  pdf.text('IDADE:', margin + col1Width + col2Width + 2, yPos + 4);

  pdf.setFont('helvetica', 'normal');
  if (data.altura) pdf.text(data.altura, margin + 30, yPos + 4);
  if (data.peso) pdf.text(data.peso, margin + col1Width + 25, yPos + 4);
  if (data.idade) pdf.text(data.idade, margin + col1Width + col2Width + 28, yPos + 4);

  yPos += measureRowHeight;

  // Linha com PINTURA e FOTO
  const pinturaWidth = (pageWidth - 2 * margin) / 2;
  pdf.rect(margin, yPos, pinturaWidth, measureRowHeight);
  pdf.rect(margin + pinturaWidth, yPos, pinturaWidth, measureRowHeight);

  pdf.setFont('helvetica', 'bold');
  pdf.text('PINTURA', margin + 2, yPos + 4);
  pdf.text('FOTO', margin + pinturaWidth + 2, yPos + 4);

  // Checkboxes para PINTURA
  const pinturaStartX = margin + 40;
  pdf.text('(', pinturaStartX, yPos + 4);
  pdf.rect(pinturaStartX + 5, yPos + 1, 3, 3);
  if (data.pintura) pdf.text('X', pinturaStartX + 6, yPos + 3);
  pdf.text(') SIM    (', pinturaStartX + 12, yPos + 4);
  pdf.rect(pinturaStartX + 28, yPos + 1, 3, 3);
  if (!data.pintura) pdf.text('X', pinturaStartX + 29, yPos + 3);
  pdf.text(') NÃO', pinturaStartX + 35, yPos + 4);

  // Checkboxes para FOTO
  const fotoStartX = margin + pinturaWidth + 40;
  pdf.text('(', fotoStartX, yPos + 4);
  pdf.rect(fotoStartX + 5, yPos + 1, 3, 3);
  if (data.foto) pdf.text('X', fotoStartX + 6, yPos + 3);
  pdf.text(') SIM    (', fotoStartX + 12, yPos + 4);
  pdf.rect(fotoStartX + 28, yPos + 1, 3, 3);
  if (!data.foto) pdf.text('X', fotoStartX + 29, yPos + 3);
  pdf.text(') NÃO', fotoStartX + 35, yPos + 4);

  yPos += measureRowHeight + 2;
  
  
  // Seção CATEGORIAS
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setFillColor(200, 200, 200);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 6, 'F');
  pdf.text('CATEGORIAS', pageWidth / 2, yPos + 4, { align: 'center' });

  yPos += 6;

  // Tabela de categorias
  const categoryRowHeight = 6;
  const categoryColWidth = (pageWidth - 2 * margin - 80) / 6; // 6 subcategorias
  const subcategoryHeaders = ['TEEN', 'ESTREANT.', 'NOVICE', 'OPEN', 'MASTER', 'CLASSE'];

  // Cabeçalho da tabela de categorias femininas
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);

  // Header FEMININAS
  pdf.rect(margin, yPos, 80, categoryRowHeight);
  pdf.text('FEMININAS', margin + 2, yPos + 4);

  // Headers das subcategorias
  subcategoryHeaders.forEach((header, index) => {
    pdf.rect(margin + 80 + (index * categoryColWidth), yPos, categoryColWidth, categoryRowHeight);
    pdf.text(header, margin + 82 + (index * categoryColWidth), yPos + 4);
  });

  yPos += categoryRowHeight;

  // Categorias femininas
  const femCategories = ['ESPECIAL', 'BIKINI', 'FIGURE', 'WOMEN\'S PHYSIQUE', 'WELLNESS'];

  femCategories.forEach(category => {
    pdf.setFont('helvetica', 'normal');
    pdf.rect(margin, yPos, 80, categoryRowHeight);
    pdf.text(category, margin + 2, yPos + 4);

    // Células das subcategorias
    subcategoryHeaders.forEach((subcat, index) => {
      pdf.rect(margin + 80 + (index * categoryColWidth), yPos, categoryColWidth, categoryRowHeight);
      // Marcar X se categoria e subcategoria correspondem
      if (data.genero === 'feminino' && data.categoria === category && data.subcategoria === subcat.replace('.', '')) {
        pdf.text('X', margin + 80 + (index * categoryColWidth) + categoryColWidth/2 - 2, yPos + 4);
      }
    });

    yPos += categoryRowHeight;
  });

  yPos += 2;

  // Tabela de categorias masculinas
  pdf.setFont('helvetica', 'bold');

  // Header MASCULINAS
  pdf.rect(margin, yPos, 80, categoryRowHeight);
  pdf.text('MASCULINAS', margin + 2, yPos + 4);

  // Headers das subcategorias (repetir)
  subcategoryHeaders.forEach((header, index) => {
    pdf.rect(margin + 80 + (index * categoryColWidth), yPos, categoryColWidth, categoryRowHeight);
    pdf.text(header, margin + 82 + (index * categoryColWidth), yPos + 4);
  });

  yPos += categoryRowHeight;

  // Categorias masculinas
  const mascCategories = ['BODYSHAPE', 'ESPECIAL', 'BODYBUILDING', 'CLASSIC PHYSIQUE', 'MEN\'S PHYSIQUE'];

  mascCategories.forEach(category => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.rect(margin, yPos, 80, categoryRowHeight);
    pdf.text(category, margin + 2, yPos + 4);

    // Células das subcategorias
    subcategoryHeaders.forEach((subcat, index) => {
      pdf.rect(margin + 80 + (index * categoryColWidth), yPos, categoryColWidth, categoryRowHeight);
      // Marcar X se categoria e subcategoria correspondem
      if (data.genero === 'masculino' && data.categoria === category && data.subcategoria === subcat.replace('.', '')) {
        pdf.text('X', margin + 80 + (index * categoryColWidth) + categoryColWidth/2 - 2, yPos + 4);
      }
    });

    yPos += categoryRowHeight;
  });

  yPos += 2;
  
  // Seção ASSINATURA DO ÁRBITRO
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setFillColor(200, 200, 200);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 6, 'F');
  pdf.text('ASSINATURA DO ÁRBITRO RESPONSÁVEL PELA VERIFICAÇÃO:', margin + 2, yPos + 4);

  yPos += 6;

  // Local e data
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 6);
  pdf.text('Local: ________________, ______ de _______________ de 2023', margin + 2, yPos + 4);

  yPos += 6;

  // Linha de assinaturas
  const signatureHeight = 12;
  pdf.rect(margin, yPos, (pageWidth - 2 * margin) / 2, signatureHeight);
  pdf.rect(margin + (pageWidth - 2 * margin) / 2, yPos, (pageWidth - 2 * margin) / 2, signatureHeight);

  pdf.text('Assinatura', margin + 20, yPos + signatureHeight - 2);
  pdf.text('Assinatura do responsável para menores de 18 anos', margin + (pageWidth - 2 * margin) / 2 + 10, yPos + signatureHeight - 2);

  yPos += signatureHeight + 2;

  // Seção RECIBO DO ATLETA (simplificada)
  pdf.setFont('helvetica', 'bold');
  pdf.setFillColor(200, 200, 200);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 6, 'F');
  pdf.text('RECIBO DO ATLETA', pageWidth / 2, yPos + 4, { align: 'center' });

  yPos += 6;

  // Nome do atleta no recibo
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.rect(margin, yPos, 80, 8);
  pdf.rect(margin + 80, yPos, 50, 8);
  pdf.rect(margin + 130, yPos, pageWidth - 2 * margin - 130, 8);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Nome:', margin + 2, yPos + 7);
  pdf.text('PINTURA', margin + 82, yPos + 7);
  pdf.text('FOTO', margin + 132, yPos + 7);

  pdf.setFont('helvetica', 'normal');
  if (data.nome) pdf.text(data.nome, margin + 25, yPos + 7);

  // Checkboxes PINTURA no recibo
  const reciboStartX = margin + 105;
  pdf.text('(', reciboStartX, yPos + 7);
  pdf.rect(reciboStartX + 3, yPos + 3, 3, 3);
  if (data.pintura) pdf.text('X', reciboStartX + 4, yPos + 6);
  pdf.text(') SIM  (', reciboStartX + 8, yPos + 7);
  pdf.rect(reciboStartX + 18, yPos + 3, 3, 3);
  if (!data.pintura) pdf.text('X', reciboStartX + 19, yPos + 6);
  pdf.text(') NÃO', reciboStartX + 23, yPos + 7);

  // Checkboxes FOTO no recibo
  const fotoReciboX = margin + 155;
  pdf.text('(', fotoReciboX, yPos + 7);
  pdf.rect(fotoReciboX + 3, yPos + 3, 3, 3);
  if (data.foto) pdf.text('X', fotoReciboX + 4, yPos + 6);
  pdf.text(') SIM  (', fotoReciboX + 8, yPos + 7);
  pdf.rect(fotoReciboX + 18, yPos + 3, 3, 3);
  if (!data.foto) pdf.text('X', fotoReciboX + 19, yPos + 6);
  pdf.text(') NÃO', fotoReciboX + 23, yPos + 7);

  yPos += 8;

  // Tabela de categorias simplificada no recibo
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);

  pdf.rect(margin, yPos, 50, 6);
  pdf.rect(margin + 50, yPos, 50, 6);
  pdf.rect(margin + 100, yPos, pageWidth - 2 * margin - 100, 6);

  pdf.text('CATEGORIAS', margin + 2, yPos + 4);
  pdf.text('SUB-CATEGORIAS', margin + 52, yPos + 4);
  pdf.text('CLASSES', margin + 102, yPos + 4);

  // Salvar o PDF
  const fileName = `inscricao_${data.nome.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`;
  pdf.save(fileName);
};