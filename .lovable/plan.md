

## Plano: Busca por Telefone, Gestão de Prazos Aprimorada e Sistema de Notificações

### Resumo
Três funcionalidades integradas: (1) busca por telefone com normalização, (2) melhorias na gestão de prazos com contagem regressiva substituindo o badge "No prazo", e (3) sistema de notificações/lembretes por atendimento com persistência no banco.

---

### 1. Busca por Telefone

**Alterações:**
- **`src/pages/BuscarProtocolo.tsx`** — Adicionar aba/toggle para alternar entre busca por protocolo e busca por telefone. Na busca por telefone:
  - Normalizar input removendo `(`, `)`, `-`, espaços, `+55`
  - Buscar com `ilike` no campo `telefone` usando o número normalizado
  - Retornar lista (não single) de atendimentos vinculados ao telefone
  - Exibir: solicitante, protocolo, status, data de abertura
  - Debounce de 300ms no input
  - Estados: loading, vazio, resultados
- **`src/hooks/use-atendimentos.ts`** — Adicionar função `useBuscarPorTelefone` que normaliza e busca com filtro textual

**Sem alteração no banco** — busca usa campo `telefone` existente com filtro `ilike` no lado do cliente/query.

---

### 2. Gestão de Prazos Aprimorada

**Alterações:**
- **`src/components/sla/SlaBadge.tsx`** — Substituir o estado "No prazo" por contagem regressiva dinâmica (ex: "1d 3h restantes"). Manter badges "Próximo do vencimento" e "Vencido" com cores.
- **`src/components/sla/SlaCountdown.tsx`** — Atualizar intervalo para 1 minuto, exibir formato "Xd Xh Xmin restantes"
- **`src/lib/sla-utils.ts`** — Já implementado, sem mudanças
- **`src/pages/CalendarioSLA.tsx`** — Filtrar atendimentos finalizados (não exibir no calendário)
- **`src/pages/Atendimentos.tsx`** — Preservar filtros ao navegar e voltar (usar URL params ou state). Adicionar ordenação crescente/decrescente no botão "Ordenar prazos"
- **`src/pages/Atrasados.tsx`** — Já filtra finalizados, sem mudanças

---

### 3. Sistema de Notificações/Lembretes

**Novo no banco (migração):**
```sql
CREATE TABLE public.notificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  atendimento_id uuid NOT NULL,
  data_alerta timestamptz NOT NULL,
  justificativa text,
  lida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notificacoes"
  ON public.notificacoes FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Novos componentes:**
- **`src/components/notificacoes/CriarLembreteModal.tsx`** — Modal com: seletor de data (calendar), seletor de horário, campo de justificativa. Ícone de sino em cada ticket para abrir.
- **`src/components/notificacoes/NotificacoesDropdown.tsx`** — Dropdown no header (ícone de sino já existente). Lista notificações cujo `data_alerta <= now()` e `lida = false`. Marcar como lida ao clicar. Badge com contagem real substituindo o "3" hardcoded atual.
- **`src/hooks/use-notificacoes.ts`** — CRUD de notificações com React Query + realtime subscription

**Arquivos modificados:**
- **`src/components/layout/Header.tsx`** — Integrar `NotificacoesDropdown` no sino existente com contagem real
- **`src/pages/DetalhesAtendimento.tsx`** — Adicionar ícone de sino ao lado do protocolo para criar lembrete
- **`src/pages/Atendimentos.tsx`** — Adicionar ícone de sino pequeno em cada linha da tabela

---

### Arquivos novos (4)
- `src/components/notificacoes/CriarLembreteModal.tsx`
- `src/components/notificacoes/NotificacoesDropdown.tsx`
- `src/hooks/use-notificacoes.ts`
- Migração SQL para tabela `notificacoes`

### Arquivos modificados (7)
- `src/pages/BuscarProtocolo.tsx`
- `src/hooks/use-atendimentos.ts`
- `src/components/sla/SlaBadge.tsx`
- `src/pages/CalendarioSLA.tsx`
- `src/pages/Atendimentos.tsx`
- `src/pages/DetalhesAtendimento.tsx`
- `src/components/layout/Header.tsx`

### Sem alterações em
- Status do atendimento / fluxo existente
- Edge functions existentes
- Tabelas `atendimentos`, `atualizacoes`, `profiles`

