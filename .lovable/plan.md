

## Plano: Calendário de Notificações

Transformar o `CalendarioSLA` atual para exibir **notificações** (lembretes) ao invés de prazos de SLA, mantendo o layout visual existente.

### 1. Fonte de dados

**Hook atual**: `useAtendimentos()` → filtra por `prazo_resolucao`.
**Novo**: usar `useNotificacoes()` (já existe, com realtime) e enriquecer cada notificação com dados do atendimento (solicitante, status, protocolo).

Enriquecer `useNotificacoes` para também trazer `solicitante` e `status` do atendimento (já traz `protocolo`):

```ts
const { data: atendimentos } = await supabase
  .from("atendimentos")
  .select("id, protocolo, solicitante, status, assunto")
  .in("id", ids);
```

Tipo `Notificacao` ganha campos opcionais: `solicitante`, `status`, `assunto`.

### 2. Página `CalendarioSLA.tsx` → renomear conceito para "Calendário de Notificações"

- Manter título da rota e arquivo (sem quebrar navegação), apenas mudar copy: **"Calendário de Notificações"**.
- Substituir `useAtendimentos` por `useNotificacoes`.
- Agrupar por dia usando `data_alerta` (não `prazo_resolucao`).
- Filtrar somente notificações do mês visível.

### 3. Card da notificação no calendário (desktop + mobile)

Cada evento exibe:
- **Hora** do alerta (ex: `09:00`)
- **Protocolo** do atendimento
- **Solicitante** (truncado)
- **Status** badge (usando `statusLabels`)
- **Tempo restante** até `data_alerta` (função utilitária — reaproveitar `getTempoRestante` adaptada ou criar `getTempoRestanteAlerta`)
- Indicador visual se já está **vencida** (data_alerta <= now) e/ou **lida**

Estilo: manter visual de cards compactos dentro da célula (igual hoje).

### 4. Interação ao clicar — Modal de detalhes

Criar componente `DetalheNotificacaoModal.tsx` em `src/components/notificacoes/`:

- **Conteúdo**:
  - Cabeçalho: data/hora do alerta + badge de status da notificação (lida/pendente/vencida)
  - Justificativa completa (com `whitespace-pre-wrap`)
  - Card resumido do atendimento: protocolo, solicitante, assunto, status, prazo
  - Tempo restante destacado
- **Ações**:
  - **"Ir para o atendimento"** → `navigate(/atendimento/:id)`
  - **"Editar"** (apenas admin/ouvidor) → abre `CriarLembreteModal` em modo edição
  - **"Excluir"** (apenas admin/ouvidor) → `AlertDialog` de confirmação → `useExcluirNotificacao`
  - **"Marcar como lida"** (se aplicável) → `useMarcarLida`

### 5. Permissões

Reutilizar `useAuth()` → `isAdmin`, `isOuvidor`.
- Visualização: todos veem o calendário com **suas próprias notificações** (já garantido via RLS atual: SELECT inclui own + admin/ouvidor para todas).
- Editar/Excluir: apenas admin/ouvidor (já implementado nas RLS e no dropdown).

### 6. Realtime

Já garantido via `useNotificacoes` (canal `notificacoes-${userId}` invalida queries em `*` events). Ao criar/editar/excluir lembrete em qualquer lugar do sistema, o calendário atualiza automaticamente.

### 7. Responsividade

Manter dois modos já existentes:
- **Desktop (`md+`)**: grid 7 colunas, cards dentro de cada célula com `max-h` e scroll.
- **Mobile**: lista agrupada por dia (igual hoje).

Modal usa `Dialog` shadcn com `max-w-lg` e padding adaptado para mobile.

### Arquivos a alterar/criar

- **alterar** `src/hooks/use-notificacoes.ts` — incluir `solicitante`, `status`, `assunto` no enriquecimento
- **alterar** `src/pages/CalendarioSLA.tsx` — trocar fonte de dados, copy, renderização dos cards, abrir modal no clique
- **criar** `src/components/notificacoes/DetalheNotificacaoModal.tsx` — modal de detalhes + ações
- (opcional) renomear futuramente o arquivo para `CalendarioNotificacoes.tsx` — **não** nesta entrega para não quebrar rota

### Diagrama de fluxo

```text
useNotificacoes (realtime)
        │
        ▼
CalendarioSLA (grid mensal)
        │ click
        ▼
DetalheNotificacaoModal
   ├── Ir para atendimento  → /atendimento/:id
   ├── Editar (admin/ouvidor) → CriarLembreteModal (edit)
   ├── Excluir (admin/ouvidor) → AlertDialog → useExcluirNotificacao
   └── Marcar como lida → useMarcarLida
```

