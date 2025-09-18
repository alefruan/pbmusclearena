# Configuração do Banco de Dados

## Problema Identificado

Os erros mostrados no console indicam que as tabelas `registrations` e `settings` não existem no banco de dados Supabase.

## Solução

Para corrigir o problema e permitir que o sistema funcione corretamente:

### 1. Acesse o painel do Supabase

1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Acesse o projeto do PB MUSCLE ARENA

### 2. Execute o Script SQL

1. No painel do Supabase, vá para **SQL Editor**
2. Copie todo o conteúdo do arquivo `database-setup.sql`
3. Cole no editor SQL
4. Clique em **Run** para executar o script

### 3. Verifique se as tabelas foram criadas

1. Vá para **Table Editor**
2. Verifique se as seguintes tabelas foram criadas:
   - `registrations` - Para armazenar as inscrições
   - `settings` - Para armazenar configurações (incluindo o texto do regulamento)

### 4. Teste o sistema

Após executar o script:

1. **Inscrições**: O painel admin deve mostrar as inscrições (inicialmente vazio)
2. **Regulamento**: O botão "Editar Regulamento" deve funcionar
3. **Formulário**: Novas inscrições devem ser salvas no banco

## Estrutura das Tabelas

### Tabela `registrations`
Armazena todas as inscrições do evento com campos para:
- Identificação pessoal
- Medições corporais
- Categorias de competição
- Aceitação do regulamento

### Tabela `settings`
Armazena configurações do sistema:
- `key`: Nome da configuração
- `value`: Valor da configuração
- Exemplo: `regulamento` → texto do regulamento

## Segurança

O script inclui:
- Row Level Security (RLS) habilitado
- Políticas que permitem acesso público (adequado para sistema de inscrições)
- Índices para melhor performance

## Troubleshooting

Se ainda houver problemas:

1. **Verifique as permissões**: Certifique-se de que as políticas RLS estão ativas
2. **Teste a conexão**: Verifique se o arquivo `supabaseClient.ts` tem as credenciais corretas
3. **Console do navegador**: Verifique se ainda há erros relacionados ao banco

## Contato

Se precisar de ajuda adicional, verifique:
- Logs do Supabase
- Console do navegador
- Arquivo de configuração do Supabase