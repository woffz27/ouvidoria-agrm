

## Plano: Favicon + Cor do Sidebar + Fundo cinza + Excluir atendimento

### 1. Favicon
- Copiar `user-uploads://favicon.ico` para `public/favicon.ico`
- Atualizar `index.html` para referenciar o novo favicon

### 2. Cor do sidebar (R24 G94 B169 = `#185EA9` → HSL `207 75% 38%`)
Em `src/index.css`, alterar as variáveis do sidebar no tema light:
- `--sidebar-background: 207 75% 38%`
- `--sidebar-foreground: 0 0% 95%`
- `--sidebar-accent: 207 75% 32%`
- `--sidebar-border: 207 60% 30%`

E no tema dark, ajustar proporcionalmente para tom mais escuro.

### 3. Fundo cinza claro (remover branco puro)
Alterar `--card` de `0 0% 100%` para `210 15% 97%` no tema light, deixando cards e áreas de conteúdo em cinza muito claro.

### 4. Excluir atendimento
- **Migration SQL**: Criar RLS policy para DELETE na tabela `atendimentos`
- **Hook**: Criar `useExcluirAtendimento` em `use-atendimentos.ts`
- **DetalhesAtendimento.tsx**: Botão "Excluir" com AlertDialog de confirmação, redireciona para `/atendimentos` após exclusão
- **Atendimentos.tsx**: Botão de exclusão na tabela com confirmação

### Arquivos a modificar
- `public/favicon.ico` (copiar upload)
- `index.html` — referência do favicon
- `src/index.css` — cores sidebar + card
- `src/hooks/use-atendimentos.ts` — hook excluir
- `src/pages/DetalhesAtendimento.tsx` — botão excluir
- `src/pages/Atendimentos.tsx` — botão excluir na tabela
- Migration SQL — RLS DELETE policy

