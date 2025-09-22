import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Interface para os dados de curso
interface CursoData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
  curso: string;
  cursoId?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Template de email HTML para curso
function createCursoEmailTemplate(data: CursoData): string {
  const cursoNumero = data.cursoId ? String(data.cursoId).padStart(6, '0') : '000000';

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; color: #dc5e28; border-bottom: 3px solid #dc5e28; padding-bottom: 20px; margin-bottom: 20px; }
            .content { line-height: 1.6; }
            .info-section { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .course-number { background: #dc5e28; color: white; text-align: center; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 24px; font-weight: bold; }
            .course-info { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4caf50; }
            .event-details { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196f3; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
            .highlight { color: #dc5e28; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏆 PB MUSCLE ARENA 🏆</h1>
                <h2>Inscrição no Curso Confirmada!</h2>
            </div>

            <div class="content">
                <p>Olá <strong>${data.nome}</strong>,</p>

                <p>Sua inscrição no curso do evento <strong>PB MUSCLE ARENA</strong> foi registrada com sucesso!</p>

                <div class="course-number">
                    📚 INSCRIÇÃO Nº #${cursoNumero}
                </div>

                <div class="course-info">
                    <h3>🎓 Curso Selecionado</h3>
                    <p style="font-size: 18px; font-weight: bold; color: #2e7d32; margin: 0;">
                        ${data.curso}
                    </p>
                </div>

                <div class="info-section">
                    <h3>📋 Dados da Inscrição:</h3>
                    <p><strong>Nome:</strong> ${data.nome}</p>
                    <p><strong>CPF:</strong> ${data.cpf}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Telefone:</strong> ${data.telefone}</p>
                    <p><strong>Cidade/UF:</strong> ${data.cidade}/${data.uf}</p>
                </div>

                <div class="event-details">
                    <h3>📅 Detalhes do Evento</h3>
                    <p><strong>Data:</strong> <span class="highlight">15 e 16 de Novembro de 2025</span></p>
                    <p><strong>Local:</strong> <span class="highlight">Teatro Pedra do Reino</span></p>
                    <p><strong>Cidade:</strong> <span class="highlight">João Pessoa - PB</span></p>
                </div>

                <div class="info-section">
                    <h3>⚠️ Informações Importantes</h3>
                    <ul>
                        <li><strong>Guarde este número da inscrição:</strong> #${cursoNumero}</li>
                        <li>Apresente um documento com foto no momento do curso</li>
                        <li>Chegue com antecedência para fazer seu credenciamento</li>
                        <li>Os cursos começarão pontualmente no horário programado</li>
                        <li>Material didático será disponibilizado durante o curso</li>
                        <li>Certificado será emitido ao final do curso</li>
                    </ul>
                </div>

                <p><strong>🎉 Te esperamos lá para uma experiência de aprendizado incrível!</strong></p>

                <p>Em caso de dúvidas, entre em contato conosco através do email <strong>cursos@pbmusclearena.com</strong></p>

                <p style="color: #dc5e28; font-weight: bold;">Nos vemos no PB MUSCLE ARENA! 📚💪</p>
            </div>

            <div class="footer">
                <p><strong>PB MUSCLE ARENA</strong><br>
                Email: cursos@pbmusclearena.com<br>
                Website: pbmusclearena.com</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cursoData } = await req.json()

    if (!cursoData) {
      return new Response(
        JSON.stringify({ error: 'Dados do curso são obrigatórios' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verificar se temos a chave da API do Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.log('RESEND_API_KEY not configured - simulating email send');

      // Simular envio de email para desenvolvimento
      const emailHtml = createCursoEmailTemplate(cursoData)

      console.log('Simulated curso email sent to:', cursoData.email);
      console.log('CC: cursos@pbmusclearena.com');
      console.log('Email template created successfully');

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email de curso simulado com sucesso (configure RESEND_API_KEY para envio real)',
          simulation: true,
          recipients: [cursoData.email, 'cursos@pbmusclearena.com']
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Criar template do email
    const emailHtml = createCursoEmailTemplate(cursoData)

    // Preparar dados para envio via Resend
    const emailData = {
      from: 'PB Muscle Arena <cursos@pbmusclearena.com>',
      to: [cursoData.email],
      cc: ['cursos@pbmusclearena.com'],
      subject: `🎓 Inscrição no Curso Confirmada - PB MUSCLE ARENA - ${cursoData.nome}`,
      html: emailHtml,
    }

    // Enviar email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    const result = await response.json()

    if (response.ok) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email de curso enviado com sucesso',
          emailId: result.id
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.error('Erro ao enviar email de curso:', result)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Falha ao enviar email de curso',
          details: result
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Erro interno:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro interno do servidor',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})