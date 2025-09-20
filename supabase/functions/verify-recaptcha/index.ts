import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()

    console.log('Received reCAPTCHA verification request');

    if (!token) {
      console.log('No token provided');
      return new Response(
        JSON.stringify({ error: 'Token do reCAPTCHA é obrigatório' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verificar token com Google reCAPTCHA
    const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY')

    if (!secretKey) {
      console.log('RECAPTCHA_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Chave secreta do reCAPTCHA não configurada' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Verifying token with Google reCAPTCHA');

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`
    const formData = new FormData()
    formData.append('secret', secretKey)
    formData.append('response', token)

    const response = await fetch(verifyUrl, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    console.log('Google reCAPTCHA response:', result);

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          score: result.score,
          action: result.action
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      console.log('reCAPTCHA verification failed:', result['error-codes']);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token inválido',
          'error-codes': result['error-codes']
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Error in reCAPTCHA verification:', error);
    return new Response(
      JSON.stringify({
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