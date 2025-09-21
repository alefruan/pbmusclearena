import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib@^1.17.1";

// Interface para os dados de inscrição
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

export async function generatePDFBuffer(data: RegistrationData): Promise<Uint8Array> {
  // Criar um novo documento PDF
  const pdfDoc = await PDFDocument.create();

  // Adicionar uma página
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
  const { width, height } = page.getSize();

  // Carregar fonte padrão
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let yPos = height - 40;
  const margin = 28; // Aproximadamente 10mm
  const rowHeight = 17; // Aproximadamente 6 de jsPDF

  // Função auxiliar para desenhar texto
  const drawText = (text: string, x: number, y: number, size = 9, fontType = font) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: fontType,
      color: rgb(0, 0, 0),
    });
  };

  // Função auxiliar para desenhar retângulo
  const drawRect = (x: number, y: number, w: number, h: number, fill = false) => {
    page.drawRectangle({
      x,
      y: y - h, // pdf-lib usa coordenadas diferentes
      width: w,
      height: h,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.5,
      color: fill ? rgb(0.78, 0.78, 0.78) : undefined, // 200,200,200
    });
  };

  // Número do formulário (canto superior direito)
  drawText('Nº', width - 99, yPos + 6, 10);
  drawRect(width - 71, yPos + 11, 57, 23);

  // Cabeçalho principal
  drawText('FORMULÁRIO DE INSCRIÇÃO', width / 2 - 110, yPos - 15, 16, boldFont);

  yPos -= 35;

  // Texto de autorização
  const authText = "No ato de inscrição, e para todos os fins de direito, o atleta autoriza à PB Muscle Arena e aos fotógrafos do evento o uso de sua imagem para fins de divulgação de todo e qualquer item relacionado à PB Muscle Arena, sendo esta uma expressão de sua própria vontade, e nada terá a reclamar a título de direitos relacionados à sua voz e imagem pela PB Muscle Arena.";

  // Quebrar texto em linhas
  const words = authText.split(' ');
  let line = '';
  const maxWidth = width - 2 * margin;

  for (const word of words) {
    const testLine = line + word + ' ';
    const testWidth = font.widthOfTextAtSize(testLine, 8);

    if (testWidth > maxWidth && line !== '') {
      drawText(line.trim(), margin, yPos, 8);
      yPos -= 12;
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    drawText(line.trim(), margin, yPos, 8);
    yPos -= 20;
  }

  // Seção IDENTIFICAÇÃO
  drawRect(margin, yPos, width - 2 * margin, 17, true);
  drawText('IDENTIFICAÇÃO', width / 2 - 45, yPos - 12, 10, boldFont);
  yPos -= 17;

  // Nome
  drawRect(margin, yPos, width - 2 * margin, rowHeight);
  drawText('Nome:', margin + 5, yPos - 12, 9, boldFont);
  if (data.nome) {
    drawText(data.nome, margin + 71, yPos - 12, 9);
  }
  yPos -= rowHeight;

  // CPF, RG, Idade
  drawRect(margin, yPos, 170, rowHeight);
  drawRect(margin + 170, yPos, 170, rowHeight);
  drawRect(margin + 340, yPos, width - 2 * margin - 340, rowHeight);

  drawText('CPF:', margin + 5, yPos - 12, 9, boldFont);
  drawText('RG:', margin + 175, yPos - 12, 9, boldFont);
  drawText('Idade:', margin + 345, yPos - 12, 9, boldFont);

  if (data.cpf) drawText(data.cpf, margin + 57, yPos - 12, 9);
  if (data.rg) drawText(data.rg, margin + 221, yPos - 12, 9);
  if (data.idade) drawText(data.idade, margin + 411, yPos - 12, 9);

  yPos -= rowHeight;

  // Endereço
  drawRect(margin, yPos, width - 2 * margin, rowHeight);
  drawText('Endereço:', margin + 5, yPos - 12, 9, boldFont);
  if (data.endereco) {
    drawText(data.endereco, margin + 99, yPos - 12, 9);
  }
  yPos -= rowHeight;

  // Cidade, UF, Telefone
  drawRect(margin, yPos, 227, rowHeight);
  drawRect(margin + 227, yPos, 85, rowHeight);
  drawRect(margin + 312, yPos, width - 2 * margin - 312, rowHeight);

  drawText('Cidade:', margin + 5, yPos - 12, 9, boldFont);
  drawText('UF:', margin + 232, yPos - 12, 9, boldFont);
  drawText('Telefone:', margin + 317, yPos - 12, 9, boldFont);

  if (data.cidade) drawText(data.cidade, margin + 79, yPos - 12, 9);
  if (data.uf) drawText(data.uf, margin + 270, yPos - 12, 9);
  if (data.telefone) drawText(data.telefone, margin + 411, yPos - 12, 9);

  yPos -= rowHeight;

  // E-mail
  drawRect(margin, yPos, width - 2 * margin, rowHeight);
  drawText('E-mail:', margin + 5, yPos - 12, 9, boldFont);
  if (data.email) {
    drawText(data.email, margin + 79, yPos - 12, 9);
  }

  yPos -= rowHeight + 6;

  // Seção PESAGEM E MEDIÇÕES
  drawRect(margin, yPos, width - 2 * margin, 17, true);
  drawText('PESAGEM E MEDIÇÕES', width / 2 - 70, yPos - 12, 10, boldFont);
  yPos -= 17;

  drawText('(Preenchimento pelo Árbitro da pesagem)', width / 2 - 105, yPos - 5, 8);
  yPos -= 22;

  // Altura, Peso, Idade
  const col1Width = 170;
  const col2Width = 170;
  const col3Width = width - 2 * margin - col1Width - col2Width;

  drawRect(margin, yPos, col1Width, rowHeight);
  drawRect(margin + col1Width, yPos, col2Width, rowHeight);
  drawRect(margin + col1Width + col2Width, yPos, col3Width, rowHeight);

  drawText('ALTURA:', margin + 5, yPos - 12, 9, boldFont);
  drawText('PESO:', margin + col1Width + 5, yPos - 12, 9, boldFont);
  drawText('IDADE:', margin + col1Width + col2Width + 5, yPos - 12, 9, boldFont);

  if (data.altura && data.altura !== '0') drawText(data.altura, margin + 85, yPos - 12, 9);
  if (data.peso && data.peso !== '0') drawText(data.peso, margin + col1Width + 71, yPos - 12, 9);
  if (data.idade) drawText(data.idade, margin + col1Width + col2Width + 79, yPos - 12, 9);

  yPos -= rowHeight;

  // Pintura e Foto
  const pinturaWidth = (width - 2 * margin) / 2;
  drawRect(margin, yPos, pinturaWidth, rowHeight);
  drawRect(margin + pinturaWidth, yPos, pinturaWidth, rowHeight);

  drawText('PINTURA', margin + 5, yPos - 12, 9, boldFont);
  drawText('FOTO', margin + pinturaWidth + 5, yPos - 12, 9, boldFont);

  // Checkboxes para PINTURA
  const pinturaStartX = margin + 114;
  drawText('(', pinturaStartX, yPos - 12, 9);
  drawRect(pinturaStartX + 14, yPos - 8, 8, 8);
  drawText(') SIM    (', pinturaStartX + 34, yPos - 12, 9);
  drawRect(pinturaStartX + 79, yPos - 8, 8, 8);
  drawText(') NÃO', pinturaStartX + 99, yPos - 12, 9);

  // Checkboxes para FOTO
  const fotoStartX = margin + pinturaWidth + 114;
  drawText('(', fotoStartX, yPos - 12, 9);
  drawRect(fotoStartX + 14, yPos - 8, 8, 8);
  drawText(') SIM    (', fotoStartX + 34, yPos - 12, 9);
  drawRect(fotoStartX + 79, yPos - 8, 8, 8);
  drawText(') NÃO', fotoStartX + 99, yPos - 12, 9);

  yPos -= rowHeight + 6;

  // Seção CATEGORIAS
  drawRect(margin, yPos, width - 2 * margin, 17, true);
  drawText('CATEGORIAS', width / 2 - 40, yPos - 12, 10, boldFont);
  yPos -= 17;

  // Categorias femininas
  const categoryRowHeight = 17;
  const categoryColWidth = (width - 2 * margin - 227) / 6;

  const bikiniSubcategories = ['ATÉ 1,60M', 'ATÉ 1,65M', 'ACIMA 1,65M'];
  const wellnessSubcategories = ['MASTER +35', 'ATÉ 1,58M', 'ATÉ 1,65M', 'ACIMA 1,65M'];
  const fitmodelSubcategories = ['ÚNICA'];

  const bikiniColWidth = (width - 2 * margin - 227) / 3;
  const wellnessColWidth = (width - 2 * margin - 227) / 4;
  const fitmodelColWidth = (width - 2 * margin - 227) / 1;

  // BIKINI FITNESS
  drawRect(margin, yPos, 227, categoryRowHeight);
  drawText('BIKINI FITNESS', margin + 5, yPos - 12, 9, boldFont);

  bikiniSubcategories.forEach((header, index) => {
    drawRect(margin + 227 + (index * bikiniColWidth), yPos, bikiniColWidth, categoryRowHeight);
    drawText(header, margin + 232 + (index * bikiniColWidth), yPos - 12, 7);
  });
  yPos -= categoryRowHeight;

  // Linha para marcar X - Bikini
  drawRect(margin, yPos, 227, categoryRowHeight);
  bikiniSubcategories.forEach((subcat, index) => {
    drawRect(margin + 227 + (index * bikiniColWidth), yPos, bikiniColWidth, categoryRowHeight);
    if (data.genero === 'feminino' && data.categoria === 'BIKINI FITNESS' && data.subcategoria === subcat) {
      drawText('X', margin + 227 + (index * bikiniColWidth) + bikiniColWidth/2 - 4, yPos - 12, 9);
    }
  });
  yPos -= categoryRowHeight;

  // WELLNESS FITNESS
  drawRect(margin, yPos, 227, categoryRowHeight);
  drawText('WELLNESS FITNESS', margin + 5, yPos - 12, 9, boldFont);

  wellnessSubcategories.forEach((header, index) => {
    drawRect(margin + 227 + (index * wellnessColWidth), yPos, wellnessColWidth, categoryRowHeight);
    drawText(header, margin + 232 + (index * wellnessColWidth), yPos - 12, 6);
  });
  yPos -= categoryRowHeight;

  // Linha para marcar X - Wellness
  drawRect(margin, yPos, 227, categoryRowHeight);
  wellnessSubcategories.forEach((subcat, index) => {
    drawRect(margin + 227 + (index * wellnessColWidth), yPos, wellnessColWidth, categoryRowHeight);
    if (data.genero === 'feminino' && data.categoria === 'WELLNESS FITNESS' && data.subcategoria === subcat) {
      drawText('X', margin + 227 + (index * wellnessColWidth) + wellnessColWidth/2 - 4, yPos - 12, 9);
    }
  });
  yPos -= categoryRowHeight;

  // FITMODEL
  drawRect(margin, yPos, 227, categoryRowHeight);
  drawText('FITMODEL', margin + 5, yPos - 12, 9, boldFont);

  fitmodelSubcategories.forEach((header, index) => {
    drawRect(margin + 227 + (index * fitmodelColWidth), yPos, fitmodelColWidth, categoryRowHeight);
    drawText(header, margin + 232 + (index * fitmodelColWidth), yPos - 12, 8);
  });
  yPos -= categoryRowHeight;

  // Linha para marcar X - Fitmodel
  drawRect(margin, yPos, 227, categoryRowHeight);
  fitmodelSubcategories.forEach((subcat, index) => {
    drawRect(margin + 227 + (index * fitmodelColWidth), yPos, fitmodelColWidth, categoryRowHeight);
    if (data.genero === 'feminino' && data.categoria === 'FITMODEL' && data.subcategoria === subcat) {
      drawText('X', margin + 227 + (index * fitmodelColWidth) + fitmodelColWidth/2 - 4, yPos - 12, 9);
    }
  });

  yPos -= categoryRowHeight + 11;

  // Categorias masculinas
  const classicMensSubcategories = ['MASTER +35', 'ATÉ 1,70M', 'ATÉ 1,74M', 'ATÉ 1,78M', 'ACIMA 1,78M'];
  const bodybuildingSubcategories = ['MASTER +35', 'ATÉ 70KG', 'ATÉ 75KG', 'ATÉ 80KG', 'ATÉ 90KG', 'ATÉ 100KG', 'ACIMA 100KG'];

  const regularColWidth = categoryColWidth;
  const bodybuildingColWidth = (width - 2 * margin - 227) / 7;

  // Header MASCULINAS
  drawRect(margin, yPos, 227, categoryRowHeight);
  drawText('MASCULINAS', margin + 5, yPos - 12, 9, boldFont);

  classicMensSubcategories.forEach((header, index) => {
    drawRect(margin + 227 + (index * regularColWidth), yPos, regularColWidth, categoryRowHeight);
    drawText(header, margin + 232 + (index * regularColWidth), yPos - 12, 6);
  });
  yPos -= categoryRowHeight;

  // Classic Physique
  drawRect(margin, yPos, 227, categoryRowHeight);
  drawText('CLASSIC PHYSIQUE', margin + 5, yPos - 12, 8);

  classicMensSubcategories.forEach((subcat, index) => {
    drawRect(margin + 227 + (index * regularColWidth), yPos, regularColWidth, categoryRowHeight);
    if (data.genero === 'masculino' && data.categoria === 'CLASSIC PHYSIQUE' && data.subcategoria === subcat) {
      drawText('X', margin + 227 + (index * regularColWidth) + regularColWidth/2 - 4, yPos - 12, 9);
    }
  });
  yPos -= categoryRowHeight;

  // Men's Physique
  drawRect(margin, yPos, 227, categoryRowHeight);
  drawText('MEN\'S PHYSIQUE', margin + 5, yPos - 12, 8);

  classicMensSubcategories.forEach((subcat, index) => {
    drawRect(margin + 227 + (index * regularColWidth), yPos, regularColWidth, categoryRowHeight);
    if (data.genero === 'masculino' && data.categoria === 'MEN\'S PHYSIQUE' && data.subcategoria === subcat) {
      drawText('X', margin + 227 + (index * regularColWidth) + regularColWidth/2 - 4, yPos - 12, 9);
    }
  });
  yPos -= categoryRowHeight;

  // Bodybuilding - header específico
  drawRect(margin, yPos, 227, categoryRowHeight);
  drawText('BODYBUILDING', margin + 5, yPos - 12, 9, boldFont);

  bodybuildingSubcategories.forEach((header, index) => {
    drawRect(margin + 227 + (index * bodybuildingColWidth), yPos, bodybuildingColWidth, categoryRowHeight);
    drawText(header, margin + 230 + (index * bodybuildingColWidth), yPos - 12, 6);
  });
  yPos -= categoryRowHeight;

  // Linha para marcar X no Bodybuilding
  drawRect(margin, yPos, 227, categoryRowHeight);
  bodybuildingSubcategories.forEach((subcat, index) => {
    drawRect(margin + 227 + (index * bodybuildingColWidth), yPos, bodybuildingColWidth, categoryRowHeight);
    if (data.genero === 'masculino' && data.categoria === 'BODYBUILDING' && data.subcategoria === subcat) {
      drawText('X', margin + 227 + (index * bodybuildingColWidth) + bodybuildingColWidth/2 - 4, yPos - 12, 9);
    }
  });

  yPos -= categoryRowHeight + 6;

  // Seção ASSINATURA DO ÁRBITRO
  drawRect(margin, yPos, width - 2 * margin, 17, true);
  drawText('ASSINATURA DO ÁRBITRO RESPONSÁVEL PELA VERIFICAÇÃO:', margin + 5, yPos - 12, 10, boldFont);
  yPos -= 17;

  // Local e data
  drawRect(margin, yPos, width - 2 * margin, 17);
  drawText('Local: ________________, ______ de _______________ de 2025', margin + 5, yPos - 12, 10);
  yPos -= 17;

  // Linha de assinaturas
  const signatureHeight = 34;
  drawRect(margin, yPos, (width - 2 * margin) / 2, signatureHeight);
  drawRect(margin + (width - 2 * margin) / 2, yPos, (width - 2 * margin) / 2, signatureHeight);

  drawText('Assinatura', margin + 57, yPos - 29, 10);
  drawText('Assinatura do responsável para menores de 18 anos', margin + (width - 2 * margin) / 2 + 28, yPos - 29, 10);

  yPos -= signatureHeight + 6;

  // Seção RECIBO DO ATLETA
  drawRect(margin, yPos, width - 2 * margin, 17, true);
  drawText('RECIBO DO ATLETA', width / 2 - 50, yPos - 12, 10, boldFont);
  yPos -= 17;

  // Nome do atleta no recibo
  drawRect(margin, yPos, 227, 23);
  drawRect(margin + 227, yPos, 142, 23);
  drawRect(margin + 369, yPos, width - 2 * margin - 369, 23);

  drawText('Nome:', margin + 5, yPos - 16, 8, boldFont);
  drawText('PINTURA', margin + 232, yPos - 16, 8, boldFont);
  drawText('FOTO', margin + 374, yPos - 16, 8, boldFont);

  if (data.nome) drawText(data.nome, margin + 71, yPos - 16, 8);

  // Checkboxes PINTURA no recibo
  const reciboStartX = margin + 298;
  drawText('(', reciboStartX, yPos - 16, 8);
  drawRect(reciboStartX + 8, yPos - 13, 8, 8);
  drawText(') SIM  (', reciboStartX + 23, yPos - 16, 8);
  drawRect(reciboStartX + 51, yPos - 13, 8, 8);
  drawText(') NÃO', reciboStartX + 65, yPos - 16, 8);

  // Checkboxes FOTO no recibo
  const fotoReciboX = margin + 440;
  drawText('(', fotoReciboX, yPos - 16, 8);
  drawRect(fotoReciboX + 8, yPos - 13, 8, 8);
  drawText(') SIM  (', fotoReciboX + 23, yPos - 16, 8);
  drawRect(fotoReciboX + 51, yPos - 13, 8, 8);
  drawText(') NÃO', fotoReciboX + 65, yPos - 16, 8);

  yPos -= 23;

  // Tabela de categorias simplificada no recibo
  drawRect(margin, yPos, 142, 17);
  drawRect(margin + 142, yPos, 142, 17);
  drawRect(margin + 284, yPos, width - 2 * margin - 284, 17);

  drawText('CATEGORIAS', margin + 5, yPos - 12, 7, boldFont);
  drawText('SUB-CATEGORIAS', margin + 147, yPos - 12, 7, boldFont);
  drawText('CLASSES', margin + 289, yPos - 12, 7, boldFont);

  // Gerar o PDF como buffer
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}