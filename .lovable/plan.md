

## Plano: Reduzir delay no carregamento de imagens/avatares

### Problema

Todas as imagens (avatares) demoram para aparecer porque:
1. O `avatar_url` salvo no banco contém `?t=timestamp` (cache-busting), forçando re-download a cada carregamento
2. As imagens só começam a carregar após a resposta da API (edge function ou query de profile)
3. Não há preload nem fallback visual suave durante o carregamento

### Solução

**1. Remover cache-busting desnecessário do URL salvo**
- `src/pages/GerenciarUsuarios.tsx` (linha 139): salvar `avatarUrl` sem `?t=${Date.now()}` no banco. O cache-busting só é necessário no momento do upload para atualizar a UI imediatamente, não para persistir.
- Após upload, usar timestamp apenas localmente para forçar refresh na lista, mas salvar URL limpa no `profiles.avatar_url`

**2. Adicionar transição suave no Avatar**
- `src/components/ui/avatar.tsx`: adicionar `onLoadingStatusChange` ou CSS `transition-opacity` no `AvatarImage` para fazer fade-in quando a imagem carrega, em vez de aparecer abruptamente

**3. Preload do avatar do usuário logado**
- `src/contexts/AuthContext.tsx`: após buscar o profile com `avatar_url`, criar um `new Image().src = url` para iniciar o download imediatamente, antes do componente renderizar

### Arquivos alterados
- `src/pages/GerenciarUsuarios.tsx` — URL sem cache-busting
- `src/components/ui/avatar.tsx` — transição suave
- `src/contexts/AuthContext.tsx` — preload do avatar do usuário logado

