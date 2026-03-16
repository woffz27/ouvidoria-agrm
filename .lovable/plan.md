

## Plano: Ícone do sidebar + Autenticação completa + Recuperação de senha + Perfil admin

### 1. Ícone do sidebar
- Copiar `user-uploads://favicon-2.ico` para `src/assets/agrm-icon.ico` (ou usar o favicon já existente)
- Em `Sidebar.tsx`, substituir o ícone `<Shield>` por uma imagem `<img>` com o "M" da AGRM (o favicon transparente enviado)

### 2. Banco de dados — novas tabelas e políticas

**Migration SQL:**
- Criar tabela `profiles` (id uuid PK → auth.users, nome_completo text, cargo text, avatar_url text, created_at, updated_at) com RLS para usuários autenticados lerem/atualizarem apenas seus dados
- Criar tabela `user_roles` com enum `app_role` (admin, user) e função `has_role()` security definer
- Trigger para criar perfil automaticamente no signup
- Atualizar RLS de `atendimentos` e `atualizacoes` para exigir autenticação (substituir `true` por `auth.uid() IS NOT NULL`)
- Inserir role admin para o primeiro usuário (ou via migration separada)

### 3. Páginas de autenticação (baseadas nos mockups)

**`src/pages/Login.tsx`** — Layout split: lado esquerdo com background azul AGRM (gotas de água, logo AGRM, texto "Bem-vindo à AGRM"), lado direito com formulário branco:
- Campos: email, senha com ícones
- Checkbox "Lembrar-me nesta máquina"
- Link "Esqueceu a senha?"
- Botão "Entrar" azul
- Link "Não tem conta? Cadastre-se"
- Responsivo: no mobile, background no topo, formulário embaixo

**`src/pages/Cadastro.tsx`** — Similar ao login, com campos nome completo, cargo, email, senha, confirmar senha

**`src/pages/RecuperarSenha.tsx`** — Layout split conforme mockup: lado esquerdo azul com "Recuperar Acesso", lado direito com formulário "Recuperar Senha" (campo email + botão "Enviar Link de Recuperação" + link "Voltar para Login")

**`src/pages/ResetPassword.tsx`** — Página para definir nova senha após clicar no link de recuperação

### 4. Proteção de rotas e contexto de autenticação

**`src/contexts/AuthContext.tsx`** — Provider com:
- Estado do usuário via `onAuthStateChange` + `getSession`
- Funções: signIn, signUp, signOut, resetPassword
- Carregar perfil e role do usuário logado

**`src/components/ProtectedRoute.tsx`** — Wrapper que redireciona para `/login` se não autenticado

### 5. Atualizar roteamento

Em `App.tsx`:
- Rotas públicas: `/login`, `/cadastro`, `/recuperar-senha`, `/reset-password`
- Rotas protegidas: todas as existentes (`/`, `/atendimentos`, etc.) envolvidas por `<ProtectedRoute>`

### 6. Atualizar sidebar e header

- **Sidebar**: mostrar nome e cargo do perfil logado (em vez de "Administrador" hardcoded)
- **Header**: avatar com iniciais do usuário, botão de logout

### 7. Assets

- Copiar `user-uploads://agrm_login_desktop_with_real_logo.png` para `src/assets/login-bg.png` (usar como background das telas de auth)
- Copiar logo AGRM dos mockups para usar nas telas

### Arquivos a criar/modificar
- Migration SQL (profiles, user_roles, has_role, trigger, RLS updates)
- `src/assets/agrm-icon.ico` (copiar favicon)
- `src/assets/login-bg.png` (copiar background)
- `src/contexts/AuthContext.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/pages/Login.tsx`
- `src/pages/Cadastro.tsx`
- `src/pages/RecuperarSenha.tsx`
- `src/pages/ResetPassword.tsx`
- `src/components/layout/Sidebar.tsx` (ícone + dados do perfil)
- `src/components/layout/Header.tsx` (logout + avatar)
- `src/App.tsx` (rotas)

