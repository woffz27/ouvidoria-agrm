

## Plano: Escurecer o azul do status "Em Andamento"

### Problema
O status "Em Andamento" usa `bg-secondary` que é o ciano vibrante (`#0EA5E9`) — claro demais como fundo de badge.

### Solução
Trocar de `bg-secondary text-secondary-foreground` para `bg-blue-600 text-white` (ou similar mais escuro) nos 4 arquivos que definem `statusColors`:

- `src/pages/Dashboard.tsx` (linha 37)
- `src/pages/Atendimentos.tsx` (linha 25)
- `src/pages/Atrasados.tsx` (linha 24)
- `src/pages/DetalhesAtendimento.tsx` (linha 28)

Também ajustar o card do Dashboard (linha 58) de `border-l-secondary` / `text-secondary` para `border-l-blue-600` / `text-blue-600`.

