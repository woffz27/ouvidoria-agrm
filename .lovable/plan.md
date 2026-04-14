

## Plano: Sistema de SLA Visual e Calendário de Prazos

### Resumo
Implementar uma camada visual de SLA independente do status, com calendário mensal, cronômetro, cores de urgência e priorização automática. Nenhuma alteração no banco de dados ou no fluxo de status existente.

### 1. Criar utilitário de SLA (`src/lib/sla-utils.ts`)

Funções puras que calculam o SLA a partir de `prazo_resolucao` e `status`:

- `getSlaStatus(prazo, status)` retorna `"no_prazo" | "atencao" | "vencido" | null`
  - `null` se não tem prazo ou está finalizado
  - `"vencido"` se prazo expirou
  - `"atencao"` se faltam menos de 48h
  - `"no_prazo"` caso contrário
- `getSlaLabel(sla)` retorna texto: "No prazo", "Próximo do vencimento", "Vencido"
- `getSlaColor(sla)` retorna classes Tailwind (verde/amarelo/vermelho)
- `getTempoRestante(prazo)` retorna string formatada ("2d 5h", "12h 30min", "Vencido há 3d")
- `getSlaSort(a, b)` comparador para ordenar por urgência (vencido primeiro, depois atenção, depois ok)

### 2. Criar componente `SlaBadge` (`src/components/sla/SlaBadge.tsx`)

Badge reutilizável que exibe o indicador SLA com ícone e cor:
- Verde com `CheckCircle2` para "No prazo"
- Amarelo com `AlertTriangle` para "Próximo do vencimento"
- Vermelho com `XCircle` para "Vencido"

### 3. Criar componente `SlaCountdown` (`src/components/sla/SlaCountdown.tsx`)

Cronômetro que mostra tempo restante/excedido, atualizado a cada minuto via `setInterval`. Exibe "Xd Xh restantes" ou "Vencido há Xd".

### 4. Adicionar SLA na página `DetalhesAtendimento.tsx`

- Após o Badge de status no cabeçalho, exibir `<SlaBadge />` ao lado
- Na seção "Prazo" (já existente), adicionar `<SlaCountdown />` abaixo da data do prazo
- Layout: `Status: "Em Andamento" | SLA: "⚠️ Próximo do vencimento" | Restam: 1d 8h`

### 5. Adicionar coluna SLA nas listagens

**`Atendimentos.tsx`**: Nova coluna "SLA" na tabela desktop e badge no card mobile, usando `<SlaBadge />`. Adicionar ordenação por SLA (mais urgente primeiro) como opção.

**`Atrasados.tsx`**: Substituir/complementar o badge "X dias" existente com `<SlaBadge />` para consistência visual.

**`Dashboard.tsx`**: Nos atendimentos recentes, exibir `<SlaBadge />` ao lado do status.

### 6. Criar página Calendário (`src/pages/CalendarioSLA.tsx`)

Visualização mensal estilo Notion:
- Grid 7 colunas (Dom-Sáb) x semanas do mês
- Cada célula mostra os protocolos com prazo naquele dia
- Card dentro da célula: nº protocolo, resumo truncado, badge de status, `<SlaBadge />`, tempo restante
- Navegação mês anterior/próximo
- Código baseado em cálculos de data simples (sem lib externa de calendário)
- Responsivo: no mobile, lista vertical por dia

### 7. Adicionar rota e menu

- Nova rota `/calendario` em `App.tsx`
- Novo item "Calendário SLA" no Sidebar com ícone `CalendarDays`

### 8. Notificações visuais no Dashboard

Adicionar seção "Alertas de SLA" no Dashboard:
- Lista de protocolos com prazo em < 48h, < 24h, < 12h
- Mensagem: "Protocolo #123 está próximo do vencimento (SLA). Recomenda-se contato com o contribuinte."
- Ordenados por urgência
- Exibidos como cards com cores de SLA

### 9. Priorização inteligente

- Na listagem de Atendimentos, adicionar botão "Ordenar por SLA" que usa `getSlaSort`
- Protocolos mais urgentes aparecem primeiro
- Destaque visual sem alterar status

---

### Arquivos novos (3)
- `src/lib/sla-utils.ts`
- `src/components/sla/SlaBadge.tsx` e `SlaCountdown.tsx`
- `src/pages/CalendarioSLA.tsx`

### Arquivos modificados (5)
- `src/pages/DetalhesAtendimento.tsx` — SLA badge + countdown
- `src/pages/Atendimentos.tsx` — coluna SLA + ordenação
- `src/pages/Atrasados.tsx` — SLA badge
- `src/pages/Dashboard.tsx` — SLA nos recentes + seção alertas
- `src/App.tsx` — rota `/calendario`
- `src/components/layout/Sidebar.tsx` — item "Calendário SLA"

### Sem alterações em
- Banco de dados (tudo calculado a partir de `prazo_resolucao` existente)
- Status do atendimento
- Regras de negócio existentes
- Edge functions

