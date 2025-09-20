import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { generatePDFBuffer } from "./pdf-generator.ts"

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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Template de email HTML
function createEmailTemplate(data: RegistrationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
            .header { text-align: center; color: #dc5e28; border-bottom: 3px solid #dc5e28; padding-bottom: 20px; margin-bottom: 20px; }
            .content { line-height: 1.6; }
            .info-section { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>PB MUSCLE ARENA</h1>
                <h2>Confirmação de Inscrição</h2>
            </div>

            <div class="content">
                <p>Olá <strong>${data.nome}</strong>,</p>

                <p>Sua inscrição para o evento <strong>PB MUSCLE ARENA</strong> foi realizada com sucesso!</p>

                <div class="info-section">
                    <h3>Dados da Inscrição:</h3>
                    <p><strong>Nome:</strong> ${data.nome}</p>
                    <p><strong>CPF:</strong> ${data.cpf}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Telefone:</strong> ${data.telefone}</p>
                    <p><strong>Categoria:</strong> ${data.categoria}</p>
                    <p><strong>Subcategoria:</strong> ${data.subcategoria}</p>
                </div>

                <p>Em anexo você encontrará o PDF com sua ficha de inscrição oficial. Guarde este documento, pois será necessário apresentá-lo no dia do evento.</p>

                <p><strong>Próximos Passos:</strong></p>
                <ul>
                    <li>Aguarde confirmação do pagamento (se aplicável)</li>
                    <li>Apresente-se no local do evento com o documento em anexo</li>
                    <li>Siga as orientações do regulamento do evento</li>
                </ul>

                <p>Em caso de dúvidas, entre em contato conosco através do email inscricao@pbmusclearena.com</p>

                <p>Boa sorte na competição!</p>
            </div>

            <div class="footer">
                <p><strong>PB MUSCLE ARENA</strong><br>
                Email: inscricao@pbmusclearena.com</p>
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
    const { registrationData } = await req.json()

    if (!registrationData) {
      return new Response(
        JSON.stringify({ error: 'Dados de inscrição são obrigatórios' }),
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
      const pdfBuffer = await generatePDFBuffer(registrationData)
      const emailHtml = createEmailTemplate(registrationData)

      console.log('Simulated email sent to:', registrationData.email);
      console.log('Email template created successfully');
      console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email simulado com sucesso (configure RESEND_API_KEY para envio real)',
          simulation: true,
          recipients: [registrationData.email, 'inscricao@pbmusclearena.com']
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Gerar PDF (placeholder por enquanto)
    const pdfBuffer = await generatePDFBuffer(registrationData)

    // Criar template do email
    const emailHtml = createEmailTemplate(registrationData)

    // Preparar dados para envio via Resend
    const emailData = {
      from: 'PB Muscle Arena <noreply@pbmusclearena.com>',
      to: [registrationData.email, 'inscricao@pbmusclearena.com'],
      subject: `Confirmação de Inscrição - ${registrationData.nome}`,
      html: emailHtml,
      attachments: [
        {
          filename: `inscricao_${registrationData.nome.replace(/\s+/g, '_').toLowerCase()}.pdf`,
          content: Array.from(pdfBuffer), // Resend espera array de bytes
        }
      ]
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
          message: 'Email enviado com sucesso',
          emailId: result.id
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.error('Erro ao enviar email:', result)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Falha ao enviar email',
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