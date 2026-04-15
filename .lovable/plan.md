

## Plano: Remover campo de busca por protocolo do Header

Remover o formulário de busca do header, deixando apenas o trigger da sidebar, notificações e perfil do usuário.

**Alterações em `src/components/layout/Header.tsx`:**

1. Remover o `useState` import e o estado `protocolo`
2. Remover o `useNavigate` import (se não houver outros usos)
3. Remover a função `handleSearch`
4. Remover o `<form>` completo (linhas 33-41) que contém o Input de busca
5. Remover o `<div className="h-5 w-px bg-border" />` antes do form (linha 31) - separador visual desnecessário sem o form

**Resultado:** Header limpo com apenas sidebar trigger, notificações, avatar e logout.

