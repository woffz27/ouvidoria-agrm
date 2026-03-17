

## Plano: Painel de Gerenciamento de Usuários (Admin)

### O que será criado

Uma nova página **"Gerenciar Usuários"** acessível apenas por admins, listando todos os usuários cadastrados com opções para:
- Visualizar nome, cargo e email de cada usuário
- Promover/remover role de admin
- Excluir o acesso de um usuário (desativar conta)

### Alterações

**1. Nova página `src/pages/GerenciarUsuarios.tsx`**
- Tabela com todos os perfis (buscar de `profiles` via edge function com service role)
- Colunas: Nome, Cargo, Email, Role (admin/user), Ações
- Botão para alternar role admin (insert/delete em `user_roles`)
- Botão para excluir acesso do usuário (delete do auth user via edge function)
- Protegida: só renderiza conteúdo se `isAdmin === true`

**2. Edge function `manage-users`**
- `GET`: lista todos os usuários (profiles + roles) usando service role key
- `POST action=toggle_role`: adiciona/remove role admin em `user_roles`
- `POST action=delete_user`: remove o usuário do auth via `admin.deleteUser()`

**3. RLS: permitir admins visualizar todos os perfis**
- Adicionar policy SELECT em `profiles` para admins: `has_role(auth.uid(), 'admin')`

**4. Sidebar — adicionar link "Usuários"**
- Em `Sidebar.tsx`, adicionar item "Usuários" com ícone `Users` visível apenas para admins (usar `isAdmin` do `useAuth`)

**5. Rota em `App.tsx`**
- Adicionar rota `/usuarios` protegida com `ProtectedRoute`

### Segurança
- A edge function valida que o chamador é admin antes de executar qualquer ação
- O usuário admin principal (Emanuell) não pode ser removido pela edge function (proteção hardcoded)

