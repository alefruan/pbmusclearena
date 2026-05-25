import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Interface para os dados de curso
interface CursoData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
  cursos: string[];
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
    <html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inscrição no Curso Confirmada - PB MUSCLE ARENA</title>
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
                            <div style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.85);letter-spacing:1px;text-transform:uppercase;">Inscrição no Curso Confirmada!</div>
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
                                Sua inscrição no curso do <strong style="color:#dc5e28;">PB MUSCLE ARENA 2026</strong> foi registrada com sucesso. Guarde o número abaixo para seu credenciamento.
                            </p>

                            <!-- Número da inscrição em destaque -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#dc5e28,#b84a1e);border-radius:10px;margin-bottom:28px;">
                                <tr><td style="padding:24px;text-align:center;">
                                    <div style="font-size:12px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:8px;">Número da Inscrição</div>
                                    <div style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:4px;">#${cursoNumero}</div>
                                </td></tr>
                            </table>

                            <!-- Cursos selecionados -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1e2a1e;border-radius:10px;border:1px solid #2d3d2d;margin-bottom:24px;">
                                <tr><td style="padding:18px 20px 10px;border-bottom:1px solid #2d3d2d;">
                                    <span style="font-size:11px;font-weight:800;letter-spacing:2px;color:#4caf50;text-transform:uppercase;">${data.cursos.length === 1 ? 'Curso Selecionado' : 'Cursos Selecionados'}</span>
                                </td></tr>
                                <tr><td style="padding:16px 20px;">
                                    ${data.cursos.map(curso =>
                                        `<span style="display:inline-block;background-color:#2d3d2d;color:#81c784;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:700;margin:4px 4px 4px 0;border:1px solid #4caf5040;">${curso}</span>`
                                    ).join('')}
                                </td></tr>
                            </table>

                            <!-- Card dados -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#242424;border-radius:10px;border:1px solid #333;margin-bottom:24px;">
                                <tr><td style="padding:18px 20px 10px;border-bottom:1px solid #333;">
                                    <span style="font-size:11px;font-weight:800;letter-spacing:2px;color:#dc5e28;text-transform:uppercase;">Dados da Inscrição</span>
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
                                            <td style="padding:7px 0;border-bottom:1px solid #2e2e2e;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Telefone</td>
                                            <td style="padding:7px 0;border-bottom:1px solid #2e2e2e;font-size:14px;color:#e0e0e0;">${data.telefone}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:7px 0;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Cidade/UF</td>
                                            <td style="padding:7px 0;font-size:14px;color:#e0e0e0;">${data.cidade} — ${data.uf}</td>
                                        </tr>
                                    </table>
                                </td></tr>
                            </table>

                            <!-- Card evento -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1e2a;border-radius:10px;border:1px solid #2d3040;margin-bottom:24px;">
                                <tr><td style="padding:18px 20px 10px;border-bottom:1px solid #2d3040;">
                                    <span style="font-size:11px;font-weight:800;letter-spacing:2px;color:#64b5f6;text-transform:uppercase;">Detalhes do Evento</span>
                                </td></tr>
                                <tr><td style="padding:16px 20px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding:7px 0;border-bottom:1px solid #2d3040;font-size:12px;color:#666;width:40%;text-transform:uppercase;letter-spacing:1px;">Data</td>
                                            <td style="padding:7px 0;border-bottom:1px solid #2d3040;font-size:14px;color:#e0e0e0;font-weight:600;">18 e 19 de Julho de 2026</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:7px 0;border-bottom:1px solid #2d3040;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Local</td>
                                            <td style="padding:7px 0;border-bottom:1px solid #2d3040;font-size:14px;color:#e0e0e0;">Teatro Pedra do Reino</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:7px 0;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Cidade</td>
                                            <td style="padding:7px 0;font-size:14px;color:#e0e0e0;">João Pessoa — PB</td>
                                        </tr>
                                    </table>
                                </td></tr>
                            </table>

                            <!-- Informações importantes -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#242424;border-radius:10px;border:1px solid #333;margin-bottom:28px;">
                                <tr><td style="padding:18px 20px 10px;border-bottom:1px solid #333;">
                                    <span style="font-size:11px;font-weight:800;letter-spacing:2px;color:#dc5e28;text-transform:uppercase;">Informações Importantes</span>
                                </td></tr>
                                <tr><td style="padding:16px 20px;">
                                    <p style="margin:0 0 8px;font-size:14px;color:#cccccc;">&#8250;&nbsp; Apresente um documento com foto no momento do curso</p>
                                    <p style="margin:0;font-size:14px;color:#cccccc;">&#8250;&nbsp; Chegue com antecedência para seu credenciamento</p>
                                </td></tr>
                            </table>

                            <p style="margin:0 0 4px;font-size:14px;color:#888;text-align:center;">Dúvidas? Fale conosco:</p>
                            <p style="margin:0;font-size:14px;color:#dc5e28;text-align:center;font-weight:600;">cursos@pbmusclearena.com</p>

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