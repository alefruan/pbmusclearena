# Configuração de Envio de Emails

Este documento explica como configurar o envio automático de emails de confirmação de inscrição com PDF anexado.

## Funcionalidades Implementadas

✅ **Envio automático de emails** após inscrição realizada
✅ **PDF anexado** ao email com ficha de inscrição oficial
✅ **Email para o atleta** (endereço informado no formulário)
✅ **Cópia para organização** (inscricao@pbmusclearena.com)
✅ **Template HTML** profissional com dados da inscrição
✅ **Fallback gracioso** - funciona mesmo se email falhar

## Configuração Necessária

### 1. Criar Conta no Resend

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Verifique seu domínio ou use o domínio de teste do Resend
4. Gere uma API Key na seção "API Keys"

### 2. Configurar Variáveis de Ambiente no Supabase

No painel do Supabase, vá em **Project Settings > Edge Functions** e adicione:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
```

### 3. Deploy da Função

Execute no terminal:

```bash
# Deploy da função de envio de email
supabase functions deploy send-email

# Verificar se a função foi implantada
supabase functions list
```

## Como Funciona

### Fluxo de Inscrição

1. **Usuário preenche** o formulário de inscrição
2. **Dados são salvos** no banco Supabase (se configurado)
3. **PDF é gerado** localmente para download imediato
4. **Função send-email é chamada** via Supabase Functions
5. **PDF é regenerado** no servidor para anexar ao email
6. **Email é enviado** para:
   - Endereço do atleta (informado no formulário)
   - inscricao@pbmusclearena.com (organização)

### Tratamento de Erros

- ✅ Se email falhar, usuário ainda recebe o PDF localmente
- ✅ Notificações claras sobre status do envio
- ✅ Logs detalhados para debugging
- ✅ Funciona mesmo sem banco configurado

## Estrutura dos Arquivos

```
supabase/
└── functions/
    └── send-email/
        ├── index.ts           # Função principal de envio
        └── pdf-generator.ts   # Geração de PDF no servidor
```

## Template de Email

O email enviado inclui:

- **Cabeçalho** com branding PB Muscle Arena
- **Dados da inscrição** (nome, categoria, etc.)
- **Instruções** para o dia do evento
- **PDF anexado** com ficha oficial
- **Contato** para dúvidas

## Testando a Configuração

### 1. Verificar Função Local

```bash
# Iniciar funções localmente
supabase functions serve

# Testar função (em outro terminal)
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-email' \
  --header 'Authorization: Bearer [YOUR_ANON_KEY]' \
  --header 'Content-Type: application/json' \
  --data '{"registrationData": {"nome": "Teste", "email": "teste@exemplo.com", ...}}'
```

### 2. Teste via Interface

1. Preencha o formulário de inscrição
2. Verifique os logs do navegador (F12 > Console)
3. Confirme recebimento do email
4. Verifique se PDF foi anexado corretamente

## Troubleshooting

### Email não está sendo enviado

1. **Verificar API Key**: Confirme se `RESEND_API_KEY` está configurada
2. **Verificar domínio**: Use domínio verificado no Resend
3. **Verificar logs**: Vá em Supabase > Functions > Logs
4. **Verificar rate limits**: Resend tem limites na conta gratuita

### PDF não está sendo anexado

1. **Verificar biblioteca pdf-lib**: Deve estar disponível via CDN
2. **Verificar memória**: PDFs grandes podem causar timeout
3. **Verificar logs da função**: Buscar erros de geração

### Domínio não verificado

Para produção, configure um domínio próprio:

1. No Resend, vá em "Domains"
2. Adicione seu domínio (ex: pbmusclearena.com)
3. Configure os registros DNS fornecidos
4. Atualize o campo `from` na função

## Custos

**Resend (Recomendado)**:
- Gratuito: 3.000 emails/mês
- Pro: $20/mês para 50.000 emails/mês

**Alternativas**:
- SendGrid (mais complexo, mas robusto)
- Nodemailer + Gmail (para volumes baixos)

## Próximos Passos

1. ✅ Configurar conta Resend
2. ✅ Adicionar variável `RESEND_API_KEY`
3. ✅ Fazer deploy da função
4. ✅ Testar com inscrição real
5. 🔄 Verificar domínio personalizado (opcional)
6. 🔄 Monitorar logs e performance

## Suporte

Para dúvidas sobre a implementação:
- Verificar logs em Supabase Functions
- Consultar documentação do Resend: [docs.resend.com](https://docs.resend.com)
- Verificar status do serviço: [status.resend.com](https://status.resend.com)