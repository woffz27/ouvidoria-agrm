

## Plano: Corrigir Cadastro de Atendimento que Não Salva

### Problema identificado

O formulário usa componentes `Select` do Radix UI com atributo `required`, mas esse atributo **não funciona** em selects customizados como os do shadcn/ui. Quando o usuário submete o formulário sem selecionar canal, categoria ou tipo de problema, valores vazios (`""`) são enviados ao banco de dados, que espera valores enum válidos. O banco rejeita a inserção e o toast de erro ("Erro ao criar atendimento") aparece brevemente, mas o usuário pode não perceber.

### Correções

1. **`src/pages/NovoAtendimento.tsx`**
   - Adicionar validação manual no `handleSubmit` antes de chamar a mutation: verificar se `canal`, `categoria` e `tipoProblema` não estão vazios
   - Se algum estiver vazio, mostrar toast de aviso informando quais campos estão faltando e retornar sem submeter
   - Melhorar a mensagem de erro do catch para incluir detalhes do erro retornado pelo banco (`error.message`)
   - Adicionar `console.error` no catch para facilitar debugging futuro

2. **`src/hooks/use-atendimentos.ts`** (melhoria menor)
   - No `onSuccess` do `useCriarAtendimento`, também invalidar a query `["estatisticas"]` para que o Dashboard atualize automaticamente

