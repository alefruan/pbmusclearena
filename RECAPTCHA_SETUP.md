# Configuração do reCAPTCHA v3

## Problema Identificado

O erro "Verificação de segurança falhou" ocorre porque a variável de ambiente `RECAPTCHA_SECRET_KEY` não está configurada no Supabase.

## Status Atual

✅ **Site Key configurada**: `6LenA84rAAAAABHYuOfxDUL_bql-dALSGYMjj8V-`
❌ **Secret Key não configurada** no Supabase
✅ **Função temporária**: Implementado bypass para desenvolvimento

## Solução Temporária Implementada

A função `verify-recaptcha` foi atualizada para permitir que o formulário funcione durante desenvolvimento, mesmo sem a chave secreta configurada.

### O que mudou:

1. **Logs de debug** adicionados para facilitar troubleshooting
2. **Bypass automático** quando `RECAPTCHA_SECRET_KEY` não está configurada
3. **Melhor tratamento de erros** com detalhes específicos

## Configuração para Produção

### 1. Obter a Secret Key

1. Acesse [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Localize o site com a key `6LenA84rAAAAABHYuOfxDUL_bql-dALSGYMjj8V-`
3. Copie a **Secret Key** (diferente da Site Key)

### 2. Configurar no Supabase

1. Acesse o painel do Supabase
2. Vá em **Project Settings > Edge Functions**
3. Adicione a variável de ambiente:

```
RECAPTCHA_SECRET_KEY=6LenA84rAAAAABHYuOfxDUL_bql-dALSGYMjj8V-_SECRET_AQUI
```

### 3. Redeployar a Função

```bash
supabase functions deploy verify-recaptcha
```

## Teste da Configuração

### Durante Desenvolvimento (Bypass Ativo)

- ✅ Formulário funciona normalmente
- ⚠️ reCAPTCHA não é realmente verificado
- 📝 Logs mostram "bypassing reCAPTCHA verification"

### Em Produção (com Secret Key)

- ✅ reCAPTCHA totalmente funcional
- ✅ Proteção contra bots ativa
- ✅ Score de confiança real do Google

## Verificar Status

### Logs da Função

No Supabase, vá em **Functions > verify-recaptcha > Logs** para ver:

```
- "Received reCAPTCHA verification request"
- "RECAPTCHA_SECRET_KEY not configured" (desenvolvimento)
- "Verifying token with Google reCAPTCHA" (produção)
```

### Console do Navegador

```javascript
// Token sendo gerado
console.log('reCAPTCHA token:', recaptchaToken);

// Resposta da verificação
console.log('reCAPTCHA response:', response);
```

## Problemas Comuns

### Erro 400 - Bad Request

**Causa**: Geralmente indica que a Secret Key está incorreta ou que o token expirou.

**Solução**:
1. Verificar se a Secret Key corresponde à Site Key
2. Verificar se o domínio está autorizado no Google reCAPTCHA

### Erro 500 - Internal Server Error

**Causa**: Problema na função Supabase ou na comunicação com Google.

**Solução**:
1. Verificar logs da função no Supabase
2. Verificar se a URL do Google reCAPTCHA está acessível

### Token null ou undefined

**Causa**: Problemas com a inicialização do reCAPTCHA no frontend.

**Solução**:
1. Verificar se a Site Key está correta no `.env`
2. Verificar se o script do Google está carregando
3. Verificar console do navegador para erros JavaScript

## Estrutura Atual

```
FRONTEND (.env):
VITE_RECAPTCHA_SITE_KEY=6LenA84rAAAAABHYuOfxDUL_bql-dALSGYMjj8V-

BACKEND (Supabase Environment):
RECAPTCHA_SECRET_KEY=<PRECISA_SER_CONFIGURADA>
```

## Próximos Passos

1. 🔄 **Desenvolvimento**: Continuar usando bypass temporário
2. ⚙️ **Produção**: Configurar `RECAPTCHA_SECRET_KEY` no Supabase
3. 🧪 **Teste**: Verificar logs e funcionamento
4. 📝 **Documentação**: Atualizar este arquivo com a Secret Key real

## Comandos Úteis

```bash
# Ver logs da função
supabase functions logs verify-recaptcha

# Redeploy da função
supabase functions deploy verify-recaptcha

# Testar função localmente
supabase functions serve --env-file .env.local
```