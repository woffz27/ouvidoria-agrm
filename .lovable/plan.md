

## Plano: Criar cargo de Ouvidor + Admin editar data de abertura

### Resumo

1. Adicionar role `ouvidor` ao enum `app_role` no banco
2. Expor `isOuvidor` no AuthContext
3. Ouvidor herda permissões de usuário normal + pode alterar status e editar campos (exceto data_abertura, última atualização, prazo)
4. Admin ganha permissão para editar `data_abertura` nos atendimentos (para migração de dados da planilha)
5. Admin pode definir data de abertura customizada ao criar novo atendimento

### Alterações

**1. Migração SQL**
- `ALTER TYPE app_role ADD VALUE 'ouvidor';`

**2. `src/contexts/AuthContext.tsx`**
- Adicionar `isOuvidor: boolean` ao contexto
- Na `fetchRole`, verificar se o usuário tem role `ouvidor`
- Expor `isOuvidor` no Provider

**3. `src/pages/DetalhesAtendimento.tsx`**
- Importar `isOuvidor` do AuthContext
- Criar helper `const canEditFields = isAdmin || isOuvidor` e `const canChangeStatus = isAdmin || isOuvidor`
- Substituir `isAdmin` por `canEditFields` nos campos editáveis (ordem_servico_caern, matrícula, logradouro, bairro, cep)
- Substituir `isAdmin` por `canChangeStatus` no select de status
- Manter `isAdmin` para: botão excluir atendimento, excluir comentários
- Ouvidor **não** pode editar: data_abertura, data_atualizacao, prazo (essas ficam somente leitura para ouvidor)
- Admin pode editar `data_abertura` via `editableField` com input de data

**4. `src/pages/Atendimentos.tsx` e `src/pages/Atrasados.tsx`**
- Importar `isOuvidor` do AuthContext
- `const canChangeStatus = isAdmin || isOuvidor`
- Substituir `isAdmin` por `canChangeStatus` no select de status inline
- Manter `isAdmin` para botão de excluir

**5. `src/pages/NovoAtendimento.tsx`**
- Para Admin: adicionar campo opcional "Data de Abertura" com date picker
- Se preenchido, enviar como `data_abertura` no insert (em vez do default `now()`)

**6. `src/pages/GerenciarUsuarios.tsx`**
- Adicionar opção de promover/rebaixar usuário para `ouvidor` (além de admin)

### Detalhes técnicos

- O enum `app_role` precisa de migração para adicionar `ouvidor`
- A função `has_role` já funciona com o novo valor do enum sem alterações
- Campos que o **Ouvidor pode editar**: solicitante (se editável), ordem_servico_caern, matrícula, logradouro, bairro, cep, status
- Campos que **só o Admin** edita: data_abertura, prazo, excluir atendimentos/comentários
- Data de abertura: Admin pode editar inline com input datetime-local

### Arquivos alterados
- 1 migração SQL
- `src/contexts/AuthContext.tsx`
- `src/pages/DetalhesAtendimento.tsx`
- `src/pages/Atendimentos.tsx`
- `src/pages/Atrasados.tsx`
- `src/pages/NovoAtendimento.tsx`
- `src/pages/GerenciarUsuarios.tsx`
- `supabase/functions/manage-users/index.ts` (ação para toggle ouvidor)

