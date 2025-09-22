import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Interface para os dados de ingresso
interface IngressoData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
  ingressoId?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Template de email HTML para ingresso
function createIngressoEmailTemplate(data: IngressoData): string {
  const ingressoNumero = data.ingressoId ? String(data.ingressoId).padStart(6, '0') : '000000';

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
            .ticket-number { background: #dc5e28; color: white; text-align: center; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 24px; font-weight: bold; }
            .event-details { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196f3; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
            .highlight { color: #dc5e28; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏆 PB MUSCLE ARENA 🏆</h1>
                <h2>Ingresso Confirmado com Sucesso!</h2>
            </div>

            <div class="content">
                <p>Olá <strong>${data.nome}</strong>,</p>

                <p>Seu ingresso para o evento <strong>PB MUSCLE ARENA</strong> foi registrado com sucesso!</p>

                <div class="ticket-number">
                    🎫 INGRESSO Nº #${ingressoNumero}
                </div>

                <div class="info-section">
                    <h3>📋 Dados do Ingresso:</h3>
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
                        <li><strong>Guarde este número do ingresso:</strong> #${ingressoNumero}</li>
                        <li>Apresente um documento com foto na entrada</li>
                        <li>Chegue com antecedência para evitar filas</li>
                        <li>O evento começará pontualmente no horário programado</li>
                        <li>Não é permitida a entrada com alimentos e bebidas</li>
                    </ul>
                </div>

                <p><strong>🎉 Te esperamos lá para presenciar os melhores atletas em ação!</strong></p>

                <p>Em caso de dúvidas, entre em contato conosco através do email <strong>ingressos@pbmusclearena.com</strong></p>

                <p style="color: #dc5e28; font-weight: bold;">Nos vemos no PB MUSCLE ARENA! 💪</p>
            </div>

            <div class="footer">
                <p><strong>PB MUSCLE ARENA</strong><br>
                Email: ingressos@pbmusclearena.com<br>
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
    const { ingressoData } = await req.json()

    if (!ingressoData) {
      return new Response(
        JSON.stringify({ error: 'Dados do ingresso são obrigatórios' }),
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
      const emailHtml = createIngressoEmailTemplate(ingressoData)

      console.log('Simulated ingresso email sent to:', ingressoData.email);
      console.log('CC: ingressos@pbmusclearena.com');
      console.log('Email template created successfully');

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email de ingresso simulado com sucesso (configure RESEND_API_KEY para envio real)',
          simulation: true,
          recipients: [ingressoData.email, 'ingressos@pbmusclearena.com']
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Criar template do email
    const emailHtml = createIngressoEmailTemplate(ingressoData)

    // Preparar dados para envio via Resend
    const emailData = {
      from: 'PB Muscle Arena <ingressos@pbmusclearena.com>',
      to: [ingressoData.email],
      cc: ['ingressos@pbmusclearena.com'],
      subject: `🎫 Ingresso Confirmado - PB MUSCLE ARENA - ${ingressoData.nome}`,
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
          message: 'Email de ingresso enviado com sucesso',
          emailId: result.id
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.error('Erro ao enviar email de ingresso:', result)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Falha ao enviar email de ingresso',
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