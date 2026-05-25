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
    <html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Inscrição - PB MUSCLE ARENA</title>
    </head>
    <body style="margin:0;padding:0;background-color:#0f0f0f;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:32px 16px;">
            <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">

                    <!-- Header laranja -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#dc5e28 0%,#b84a1e 100%);padding:36px 32px;text-align:center;">
                            <div style="font-size:11px;font-weight:800;letter-spacing:4px;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:10px;">Edição 2026</div>
                            <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:2px;text-transform:uppercase;line-height:1.2;">PB MUSCLE ARENA</div>
                            <div style="width:50px;height:3px;background:rgba(255,255,255,0.4);margin:14px auto;border-radius:2px;"></div>
                            <div style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.85);letter-spacing:1px;text-transform:uppercase;">Confirmação de Inscrição</div>
                        </td>
                    </tr>

                    <!-- Linha de destaque -->
                    <tr><td style="height:4px;background:linear-gradient(90deg,#dc5e28,#ff8c5a,#dc5e28);"></td></tr>

                    <!-- Corpo -->
                    <tr>
                        <td style="padding:36px 32px;">

                            <p style="margin:0 0 20px;font-size:16px;color:#e0e0e0;line-height:1.6;">
                                Olá, <strong style="color:#ffffff;">${data.nome}</strong>!
                            </p>
                            <p style="margin:0 0 28px;font-size:15px;color:#aaaaaa;line-height:1.7;">
                                Sua inscrição para o <strong style="color:#dc5e28;">PB MUSCLE ARENA 2026</strong> foi realizada com sucesso! Em anexo você encontrará o PDF com sua ficha oficial de inscrição.
                            </p>

                            <!-- Card dados -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#242424;border-radius:10px;border:1px solid #333;margin-bottom:24px;">
                                <tr><td style="padding:18px 20px 10px;border-bottom:1px solid #333;">
                                    <span style="font-size:11px;font-weight:800;letter-spacing:2px;color:#dc5e28;text-transform:uppercase;">Dados do Atleta</span>
                                </td></tr>
                                <tr><td style="padding:16px 20px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding:7px 0;border-bottom:1px solid #2e2e2e;font-size:12px;color:#666;width:40%;text-transform:uppercase;letter-spacing:1px;">Nome</td>
                                            <td style="padding:7px 0;border-bottom:1px solid #2e2e2e;font-size:14px;color:#e0e0e0;font-weight:600;">${data.nome}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:7px 0;border-bottom:1px solid #2e2e2e;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">CPF</td>
                                            <td style="padding:7px 0;border-bottom:1px solid #2e2e2e;font-size:14px;color:#e0e0e0;">${data.cpf}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:7px 0;border-bottom:1px solid #2e2e2e;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">E-mail</td>
                                            <td style="padding:7px 0;border-bottom:1px solid #2e2e2e;font-size:14px;color:#e0e0e0;">${data.email}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:7px 0;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Telefone</td>
                                            <td style="padding:7px 0;font-size:14px;color:#e0e0e0;">${data.telefone}</td>
                                        </tr>
                                    </table>
                                </td></tr>
                            </table>

                            <!-- Card evento -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e2a1e;border-radius:10px;border:1px solid #2d3d2d;margin-bottom:24px;">
                                <tr><td style="padding:18px 20px 10px;border-bottom:1px solid #2d3d2d;">
                                    <span style="font-size:11px;font-weight:800;letter-spacing:2px;color:#4caf50;text-transform:uppercase;">Detalhes do Evento</span>
                                </td></tr>
                                <tr><td style="padding:16px 20px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding:7px 0;border-bottom:1px solid #2d3d2d;font-size:12px;color:#666;width:40%;text-transform:uppercase;letter-spacing:1px;">Data</td>
                                            <td style="padding:7px 0;border-bottom:1px solid #2d3d2d;font-size:14px;color:#e0e0e0;font-weight:600;">18 e 19 de Julho de 2026</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:7px 0;border-bottom:1px solid #2d3d2d;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Local</td>
                                            <td style="padding:7px 0;border-bottom:1px solid #2d3d2d;font-size:14px;color:#e0e0e0;">Teatro Pedra do Reino</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:7px 0;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Cidade</td>
                                            <td style="padding:7px 0;font-size:14px;color:#e0e0e0;">João Pessoa — PB</td>
                                        </tr>
                                    </table>
                                </td></tr>
                            </table>

                            <!-- Próximos passos -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#242424;border-radius:10px;border:1px solid #333;margin-bottom:28px;">
                                <tr><td style="padding:18px 20px 10px;border-bottom:1px solid #333;">
                                    <span style="font-size:11px;font-weight:800;letter-spacing:2px;color:#dc5e28;text-transform:uppercase;">Próximos Passos</span>
                                </td></tr>
                                <tr><td style="padding:16px 20px;">
                                    <p style="margin:0 0 8px;font-size:14px;color:#cccccc;padding-left:16px;position:relative;">&#8250;&nbsp; Imprima ou salve o PDF anexo — ele será exigido no dia do evento</p>
                                    <p style="margin:0 0 8px;font-size:14px;color:#cccccc;padding-left:16px;">&#8250;&nbsp; Leia o regulamento completo disponível no site</p>
                                    <p style="margin:0;font-size:14px;color:#cccccc;padding-left:16px;">&#8250;&nbsp; Chegue com antecedência para pesagem e credenciamento</p>
                                </td></tr>
                            </table>

                            <p style="margin:0 0 4px;font-size:14px;color:#888;text-align:center;">Dúvidas? Fale conosco:</p>
                            <p style="margin:0;font-size:14px;color:#dc5e28;text-align:center;font-weight:600;">inscricao@pbmusclearena.com</p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#111;padding:24px 32px;text-align:center;border-top:1px solid #222;">
                            <div style="font-size:13px;font-weight:800;letter-spacing:2px;color:#dc5e28;text-transform:uppercase;margin-bottom:6px;">PB MUSCLE ARENA</div>
                            <div style="font-size:12px;color:#555;">© 2026 — Todos os direitos reservados</div>
                        </td>
                    </tr>

                </table>
            </td></tr>
        </table>
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
      from: 'PB Muscle Arena <inscricao@pbmusclearena.com>',
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