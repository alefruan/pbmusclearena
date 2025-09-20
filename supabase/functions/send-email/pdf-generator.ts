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

  let yPos = height - 50;
  const margin = 30;
  const lineHeight = 20;

  // Função auxiliar para desenhar texto
  const drawText = (text: string, x: number, y: number, size = 12, fontType = font) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: fontType,
      color: rgb(0, 0, 0),
    });
  };

  // Função auxiliar para desenhar retângulo
  const drawRect = (x: number, y: number, width: number, height: number, fill = false) => {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
      color: fill ? rgb(0.9, 0.9, 0.9) : undefined,
    });
  };

  // Número do formulário (canto superior direito)
  drawRect(width - 80, yPos, 50, 20);
  drawText('Nº', width - 75, yPos + 5, 10);

  // Cabeçalho principal
  drawText('FORMULÁRIO DE INSCRIÇÃO', width / 2 - 120, yPos - 30, 16, boldFont);

  yPos -= 60;

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
  drawRect(margin, yPos, width - 2 * margin, 25, true);
  drawText('IDENTIFICAÇÃO', width / 2 - 60, yPos + 8, 12, boldFont);
  yPos -= 25;

  // Campos de identificação
  const fieldHeight = 25;

  // Nome
  drawRect(margin, yPos, width - 2 * margin, fieldHeight);
  drawText('Nome:', margin + 5, yPos + 8, 10, boldFont);
  if (data.nome) {
    drawText(data.nome, margin + 50, yPos + 8, 10);
  }
  yPos -= fieldHeight;

  // CPF, RG, Idade
  const col1Width = 180;
  const col2Width = 180;
  const col3Width = width - 2 * margin - col1Width - col2Width;

  drawRect(margin, yPos, col1Width, fieldHeight);
  drawRect(margin + col1Width, yPos, col2Width, fieldHeight);
  drawRect(margin + col1Width + col2Width, yPos, col3Width, fieldHeight);

  drawText('CPF:', margin + 5, yPos + 8, 10, boldFont);
  drawText('RG:', margin + col1Width + 5, yPos + 8, 10, boldFont);
  drawText('Idade:', margin + col1Width + col2Width + 5, yPos + 8, 10, boldFont);

  if (data.cpf) drawText(data.cpf, margin + 35, yPos + 8, 10);
  if (data.rg) drawText(data.rg, margin + col1Width + 25, yPos + 8, 10);
  if (data.idade) drawText(data.idade, margin + col1Width + col2Width + 35, yPos + 8, 10);

  yPos -= fieldHeight;

  // Endereço
  drawRect(margin, yPos, width - 2 * margin, fieldHeight);
  drawText('Endereço:', margin + 5, yPos + 8, 10, boldFont);
  if (data.endereco) {
    drawText(data.endereco, margin + 65, yPos + 8, 10);
  }
  yPos -= fieldHeight;

  // Cidade, UF, Telefone
  const cityWidth = 220;
  const ufWidth = 80;
  const phoneWidth = width - 2 * margin - cityWidth - ufWidth;

  drawRect(margin, yPos, cityWidth, fieldHeight);
  drawRect(margin + cityWidth, yPos, ufWidth, fieldHeight);
  drawRect(margin + cityWidth + ufWidth, yPos, phoneWidth, fieldHeight);

  drawText('Cidade:', margin + 5, yPos + 8, 10, boldFont);
  drawText('UF:', margin + cityWidth + 5, yPos + 8, 10, boldFont);
  drawText('Telefone:', margin + cityWidth + ufWidth + 5, yPos + 8, 10, boldFont);

  if (data.cidade) drawText(data.cidade, margin + 45, yPos + 8, 10);
  if (data.uf) drawText(data.uf, margin + cityWidth + 25, yPos + 8, 10);
  if (data.telefone) drawText(data.telefone, margin + cityWidth + ufWidth + 55, yPos + 8, 10);

  yPos -= fieldHeight;

  // E-mail
  drawRect(margin, yPos, width - 2 * margin, fieldHeight);
  drawText('E-mail:', margin + 5, yPos + 8, 10, boldFont);
  if (data.email) {
    drawText(data.email, margin + 50, yPos + 8, 10);
  }
  yPos -= fieldHeight + 10;

  // Seção PESAGEM E MEDIÇÕES
  drawRect(margin, yPos, width - 2 * margin, 25, true);
  drawText('PESAGEM E MEDIÇÕES', width / 2 - 80, yPos + 8, 12, boldFont);
  yPos -= 25;

  drawText('(Preenchimento pelo Árbitro da pesagem)', width / 2 - 120, yPos, 8);
  yPos -= 20;

  // Altura, Peso, Idade na pesagem
  const measureCol1 = 180;
  const measureCol2 = 180;
  const measureCol3 = width - 2 * margin - measureCol1 - measureCol2;

  drawRect(margin, yPos, measureCol1, fieldHeight);
  drawRect(margin + measureCol1, yPos, measureCol2, fieldHeight);
  drawRect(margin + measureCol1 + measureCol2, yPos, measureCol3, fieldHeight);

  drawText('ALTURA:', margin + 5, yPos + 8, 10, boldFont);
  drawText('PESO:', margin + measureCol1 + 5, yPos + 8, 10, boldFont);
  drawText('IDADE:', margin + measureCol1 + measureCol2 + 5, yPos + 8, 10, boldFont);

  if (data.altura && data.altura !== '0') drawText(data.altura, margin + 50, yPos + 8, 10);
  if (data.peso && data.peso !== '0') drawText(data.peso, margin + measureCol1 + 35, yPos + 8, 10);
  if (data.idade) drawText(data.idade, margin + measureCol1 + measureCol2 + 40, yPos + 8, 10);

  yPos -= fieldHeight;

  // Pintura e Foto
  const serviceCol = (width - 2 * margin) / 2;

  drawRect(margin, yPos, serviceCol, fieldHeight);
  drawRect(margin + serviceCol, yPos, serviceCol, fieldHeight);

  drawText('PINTURA', margin + 5, yPos + 8, 10, boldFont);
  drawText('FOTO', margin + serviceCol + 5, yPos + 8, 10, boldFont);

  // Checkboxes para PINTURA
  drawText('( ) SIM    ( ) NÃO', margin + 60, yPos + 8, 10);

  // Checkboxes para FOTO
  drawText('( ) SIM    ( ) NÃO', margin + serviceCol + 40, yPos + 8, 10);

  yPos -= fieldHeight + 10;

  // Seção CATEGORIAS
  drawRect(margin, yPos, width - 2 * margin, 25, true);
  drawText('CATEGORIAS', width / 2 - 50, yPos + 8, 12, boldFont);
  yPos -= 25;

  // Categorias selecionadas
  drawRect(margin, yPos, width - 2 * margin, fieldHeight);
  drawText('Categoria:', margin + 5, yPos + 8, 10, boldFont);
  if (data.categoria) {
    drawText(data.categoria, margin + 70, yPos + 8, 10);
  }
  yPos -= fieldHeight;

  drawRect(margin, yPos, width - 2 * margin, fieldHeight);
  drawText('Subcategoria:', margin + 5, yPos + 8, 10, boldFont);
  if (data.subcategoria) {
    drawText(data.subcategoria, margin + 85, yPos + 8, 10);
  }
  yPos -= fieldHeight + 20;

  // Seção ASSINATURA
  drawRect(margin, yPos, width - 2 * margin, 25, true);
  drawText('ASSINATURA DO ÁRBITRO RESPONSÁVEL PELA VERIFICAÇÃO:', margin + 5, yPos + 8, 10, boldFont);
  yPos -= 25;

  // Local e data
  drawRect(margin, yPos, width - 2 * margin, fieldHeight);
  drawText('Local: ________________, ______ de _______________ de 2025', margin + 5, yPos + 8, 10);
  yPos -= fieldHeight;

  // Assinaturas
  const signatureHeight = 40;
  const signatureCol = (width - 2 * margin) / 2;

  drawRect(margin, yPos, signatureCol, signatureHeight);
  drawRect(margin + signatureCol, yPos, signatureCol, signatureHeight);

  drawText('Assinatura', margin + 20, yPos + 5, 10);
  drawText('Assinatura do responsável', margin + signatureCol + 10, yPos + 5, 10);
  drawText('(para menores de 18 anos)', margin + signatureCol + 10, yPos - 5, 8);

  // Gerar o PDF como buffer
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}