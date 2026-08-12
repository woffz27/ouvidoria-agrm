# Plano: Adicionar canal "Presencial" no atendimento

## Objetivo
Incluir a opção **Presencial** no campo "Canal de Atendimento", seguindo o mesmo padrão visual e de dados dos canais existentes (Site, WhatsApp, Telefone).

## O que será alterado

### 1. Banco de dados
- Adicionar o valor `presencial` ao enum `public.canal_type`.
- A tabela `atendimentos` já referencia esse enum, portanto passará a aceitar o novo valor automaticamente.

### 2. Tipos e labels centrais (`src/lib/mock-data.ts`)
- Expandir o tipo `CanalType` para incluir `"presencial"`.
- Adicionar `presencial: "Presencial"` em `canalLabels`.
- Incluir `presencial: 0` na estatística `porCanal` de `getEstatisticas`.

### 3. Tipos do Supabase (`src/integrations/supabase/types.ts`)
- Atualizar o enum `canal_type` e a constante `Constants.public.Enums.canal_type` para incluir `"presencial"`.

### 4. Formulário de novo atendimento (`src/pages/NovoAtendimento.tsx`)
- Adicionar ícone para `presencial` no mapa `canalIcons`.
- Substituir a lista hardcoded `(["site", "whatsapp", "telefone"] as CanalType[])` por iteração dinâmica sobre `canalLabels`.
- Usar `canalLabels[c]` para o texto do item, eliminando o ternário hardcoded.

### 5. Hook de atendimentos (`src/hooks/use-atendimentos.ts`)
- Substituir a lógica ternária que gera o label "Site/WhatsApp/Telefone" por `canalLabels[atendimento.canal]`.
- Adicionar `presencial: 0` no agrupamento `porCanal` de `useEstatisticas`.

### 6. Dashboard (`src/pages/Dashboard.tsx`)
- Substituir a lista hardcoded de canais por `(Object.keys(canalLabels) as CanalType[]).map(...)`.

### 7. Demais telas
- `DetalhesAtendimento.tsx`, `Atendimentos.tsx`, `Atrasados.tsx`, `BuscarProtocolo.tsx`, `CalendarioSLA.tsx` já usam `canalLabels[atendimento.canal]`, então exibirão o novo label automaticamente sem mudanças.

## Resultado esperado
- O dropdown "Canal de Atendimento" mostrará a nova opção **Presencial** com ícone próprio.
- Protocolos criados com esse canal serão exibidos corretamente em todas as listas, detalhes, busca, dashboard e estatísticas.
- A descrição no histórico será "Atendimento criado via Presencial".

## Riscos / pontos de atenção
- O enum `canal_type` no Postgres é uma alteração de schema. A migration deve ser aprovada antes de qualquer mudança de código dependente.
- Após a migration, `src/integrations/supabase/types.ts` precisa refletir o novo valor. Se o gerador automático não rodar imediatamente, será atualizado manualmente no mesmo turno.
