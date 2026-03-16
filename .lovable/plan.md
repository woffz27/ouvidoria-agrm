

## Plano: Corrigir Responsividade para Monitor em Modo Retrato

O problema ocorre porque vários elementos usam layouts horizontais fixos (grids, tabelas com muitas colunas, cards lado a lado) que não se adaptam bem a viewports estreitas e altas (monitor em retrato).

### Correções por arquivo

1. **`src/pages/Dashboard.tsx`**
   - Stats grid: trocar `sm:grid-cols-2 lg:grid-cols-4` para `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`
   - Cards secundários (categoria/canal/tipo): trocar `md:grid-cols-3` para `grid-cols-1 lg:grid-cols-3`
   - Tabela de recentes: garantir que colunas extras fiquem `hidden` em telas menores, usar `truncate` e `min-w-0` nos textos

2. **`src/pages/Atendimentos.tsx`**
   - Filtros: já usam `flex-col sm:flex-row`, mas os selects têm larguras fixas (`sm:w-[160px]`) que podem não caber. Torná-los `w-full` em telas pequenas com `sm:w-auto` e `min-w-[140px]`
   - Tabela: já esconde colunas com `hidden md:table-cell` / `hidden lg:table-cell` — verificar se os breakpoints estão adequados para retrato (~800-1000px largura)

3. **`src/pages/DetalhesAtendimento.tsx`**
   - Grid principal: `lg:grid-cols-3` — trocar para `grid-cols-1 xl:grid-cols-3` para que em retrato empilhe
   - Header com título + badge: adicionar `flex-wrap` para que o badge quebre linha

4. **`src/pages/NovoAtendimento.tsx`**
   - Formulário com grid de campos: verificar se usa `md:grid-cols-2` e ajustar para `grid-cols-1 lg:grid-cols-2`

5. **`src/components/layout/Header.tsx`**
   - Busca: limitar `max-w-md` apenas em telas maiores, usar `flex-1 min-w-0` para evitar overflow
   - Esconder placeholder text longo em telas pequenas

6. **`src/components/layout/Sidebar.tsx`**
   - Já usa sidebar colapsível — sem mudanças necessárias

7. **`src/index.css`**
   - Adicionar utilitários de `word-break` e `overflow-wrap` no body para evitar textos que extrapolam containers

### Resumo técnico
- Ajustar breakpoints de grid para usar `xl:` em vez de `lg:` onde layouts de 3+ colunas são usados
- Garantir `min-w-0`, `truncate`, `break-words` em textos longos (protocolos, assuntos, descrições)
- Usar `flex-wrap` em containers flex com múltiplos elementos
- Nenhum componente novo; apenas ajustes de classes Tailwind

