

## Plano: Remover animação de fade-in do avatar na navegação

### Problema

O `AvatarImage` reseta o estado `loaded` para `false` toda vez que o componente remonta (navegação entre páginas), causando a animação de fade-in repetidamente — mesmo quando a imagem já está no cache do browser.

### Solução

**`src/components/ui/avatar.tsx`** — Remover o `useEffect` que reseta `loaded` quando `src` muda, e iniciar `loaded` como `true` por padrão. Manter a transição apenas para o primeiro carregamento real usando o evento `onLoadingStatusChange` do Radix ou simplesmente removendo a animação de opacidade por completo (já que as imagens são pré-carregadas no AuthContext).

Concretamente:
- Remover linha 22-23 (`useState(false)` + `useEffect` que reseta)
- Remover a lógica de `transition-opacity` e `opacity-0/opacity-100`
- Manter apenas `className="aspect-square h-full w-full"`

Isso elimina qualquer flash/animação ao navegar entre páginas.

**1 arquivo**, ~5 linhas alteradas.

