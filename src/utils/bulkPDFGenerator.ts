import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generatePDFBlob } from './pdfGenerator';

interface RegistrationData {
  id?: number;
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

interface ProgressCallback {
  (current: number, total: number): void;
}

export const generateAllPDFsAsZip = async (
  registrations: RegistrationData[],
  onProgress?: ProgressCallback
): Promise<void> => {
  if (registrations.length === 0) {
    alert('Nenhuma inscrição disponível para gerar PDFs.');
    return;
  }

  try {
    const zip = new JSZip();
    const total = registrations.length;

    // Gerar cada PDF e adicionar ao ZIP
    for (let i = 0; i < total; i++) {
      const registration = registrations[i];

      // Callback de progresso
      if (onProgress) {
        onProgress(i + 1, total);
      }

      // Gerar PDF como Blob
      const pdfBlob = await generatePDFBlob(registration);

      // Criar nome do arquivo
      const fileName = `inscricao_${registration.nome.replace(/\s+/g, '_').toLowerCase()}_${registration.id || i}.pdf`;

      // Adicionar ao ZIP
      zip.file(fileName, pdfBlob);
    }

    // Gerar arquivo ZIP
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });

    // Fazer download do ZIP
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const zipFileName = `inscricoes_pb_muscle_arena_${timestamp}.zip`;
    saveAs(zipBlob, zipFileName);

  } catch (error) {
    console.error('Erro ao gerar PDFs em massa:', error);
    alert('Erro ao gerar os PDFs. Por favor, tente novamente.');
    throw error;
  }
};
