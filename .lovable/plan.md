

## Plano: Correções em Notificações, Filtros Persistentes e Posição do Botão Ordenar

### 1. Notificação: não remover do histórico ao excluir

**Problema:** `useMarcarLida` e `useExcluirNotificacao` fazem `DELETE` na tabela `notificacoes`, mas o histórico está na tabela `atualizacoes` — que NÃO é afetada. Logo, o histórico já permanece. Se há um bug real removendo do histórico, pode ser que a invalidação de queries esteja causando re-render que oculta os dados.

**Ação:** Verificar e garantir que `useMarcarLida` apenas deleta de `notificacoes` (já faz isso). Nenhuma alteração no `atualizacoes` ao marcar como lida/excluir. Adicionar invalidação do query do atendimento no `onSuccess` de ambas mutations para refrescar o histórico corretamente.

### 2. Filtros persistentes ao navegar para card e voltar

**Problema:** Filtros são `useState` local — resetam ao sair e voltar da página.

**Ação em `src/pages/Atendimentos.tsx`:**
- Usar `useSearchParams` do React Router para persistir `busca`, `statusFilter`, `categoriaFilter`, `tipoProblemaFilter`, `atrasadosFilter` e `ordenarSla` na URL
- Inicializar estados a partir dos search params
- Atualizar search params quando filtros mudam
- Ao voltar da página de detalhes, os filtros estarão na URL e serão restaurados

### 3. Botão "Ordenar prazos" abaixo de "Exportar PDF"

**Ação em `src/pages/Atendimentos.tsx`:**
- Mover o botão "Ordenar prazos" do card de filtros para o header, posicionado abaixo do botão "Exportar PDF"
- Empilhar verticalmente os dois botões no canto superior direito

### Arquivos modificados
- `src/pages/Atendimentos.tsx` — filtros via URL params + reposicionar botão
- `src/hooks/use-notificacoes.ts` — garantir que exclusão não toca `atualizacoes`

