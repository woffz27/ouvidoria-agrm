

## Plano: Tornar cards de status do Dashboard responsivos

### Problema
No viewport atual (768px), o grid `sm:grid-cols-2` faz 5 cards ficarem em 2 colunas + 1 sozinho, e o texto/números podem estar sendo comprimidos.

### Solução
Ajustar o grid e o conteúdo dos cards para melhor adaptação em telas menores:

### Alterações em `src/pages/Dashboard.tsx`

1. **Grid dos stat cards** (linha 84): mudar de `grid-cols-1 sm:grid-cols-2 xl:grid-cols-5` para `grid-cols-2 md:grid-cols-3 xl:grid-cols-5` — melhor distribuição em tablets
2. **Conteúdo dos cards** (linhas 88-95): tornar o layout interno mais compacto em mobile:
   - Reduzir padding: `p-5` → `p-3 sm:p-5`
   - Reduzir gap: `gap-4` → `gap-2 sm:gap-4`
   - Ícone menor em mobile: `h-11 w-11` → `h-8 w-8 sm:h-11 sm:w-11`
   - Valor menor em mobile: `text-2xl` → `text-lg sm:text-2xl`
   - Título com `truncate` para não quebrar linha

