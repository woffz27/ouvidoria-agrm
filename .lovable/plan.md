

## Plano: Reorganizar campos do formulário de Novo Atendimento

### Resumo
Mover "Ordem de Serviço CAERN" e "Matrícula do Imóvel" para o card **Informações do Solicitante**. Substituir o campo "CEP" isolado por um grupo de endereço com 3 campos: **Logradouro** (inclui número), **Bairro** e **CEP**.

### Alterações

**1. Migração de banco — adicionar colunas `logradouro` e `bairro`**
- `ALTER TABLE atendimentos ADD COLUMN logradouro text;`
- `ALTER TABLE atendimentos ADD COLUMN bairro text;`

**2. `NovoAtendimento.tsx`**
- Mover os campos "Ordem de Serviço (CAERN)" e "Matrícula (Imóvel CAERN)" do card "Detalhes do Atendimento" para o card "Informações do Solicitante"
- Substituir o campo CEP isolado por um grupo "Endereço" com 3 campos em grid:
  - Logradouro (com número) — `sm:col-span-2`
  - Bairro
  - CEP
- Adicionar `logradouro` e `bairro` ao payload do `handleSubmit`

**3. `DetalhesAtendimento.tsx`**
- Exibir os novos campos logradouro e bairro na seção de detalhes do atendimento (com edição inline para admins, seguindo o padrão existente dos campos CAERN)

**4. `use-atendimentos.ts`**
- Incluir `logradouro` e `bairro` nos selects e no mutation de criação

