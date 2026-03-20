

## Plano: Tornar tabelas e textos responsivos em tablets e celulares

### Problema
As tabelas do sistema usam layout fixo que comprime o texto em telas menores (768px e abaixo) em vez de adaptar o layout. A página de Usuários é a mais afetada -- 6 colunas visíveis sem nenhuma ocultação responsiva.

### Solução
Converter tabelas para layout de cards em telas pequenas (mobile/tablet) e manter tabelas em telas maiores. Adicionar `overflow-x-auto` como fallback.

### Alterações

**1. `src/pages/GerenciarUsuarios.tsx`**
- Em mobile/tablet (< lg): renderizar cada usuário como um Card empilhado com nome, email, status, permissão e botões de ação
- Em desktop (>= lg): manter a tabela atual
- Usar `hidden lg:block` / `block lg:hidden` para alternar entre os dois layouts

**2. `src/pages/Atendimentos.tsx`**
- Em mobile (< md): renderizar atendimentos como cards com protocolo, solicitante, status e ações
- Em desktop (>= md): manter tabela atual
- Ocultar mais colunas em breakpoints intermediários

**3. `src/pages/Atrasados.tsx`**
- Mesma abordagem: cards em mobile, tabela em desktop

**4. `src/pages/Dashboard.tsx`**
- Tabela de recentes: já tem colunas ocultas, mas adicionar `overflow-x-auto` no container
- Cards de stats: já responsivos, sem alteração

**5. `src/pages/DetalhesAtendimento.tsx`**
- Botões de ação (Enviar, WhatsApp, Email): já usam `flex-wrap`, ajustar para `w-full` em mobile
- Garantir que textos longos usem `break-words` e `min-w-0`

**6. `src/pages/BuscarProtocolo.tsx`**
- Já está bem responsivo, apenas garantir `break-words` nos resultados

Total: **4 arquivos principais** alterados (GerenciarUsuarios, Atendimentos, Atrasados, DetalhesAtendimento)

