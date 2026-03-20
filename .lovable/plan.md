## Plano: Cadastro pendente com aprovação de admin

### Como funciona hoje

Qualquer pessoa se cadastra e já consegue acessar o sistema imediatamente após confirmar o e-mail.

### Solução

Adicionar um campo `aprovado` na tabela `profiles` (default `false`). O sistema bloqueia o acesso de usuários não aprovados. Admins aprovam pelo painel de usuários.

### Alterações

**1. Migração no banco de dados**

- Adicionar coluna `aprovado boolean NOT NULL DEFAULT false` na tabela `profiles`
- Atualizar o perfil do admin principal (`emanuellleandro15@gmail.com`) para `aprovado = true`
- Atualizar perfis existentes para `aprovado = true` (para não bloquear quem já está cadastrado)

**2. Atualizar `AuthContext.tsx**`

- Buscar o campo `aprovado` junto com o perfil
- Expor `aprovado` no contexto (ou um campo `pendente`)

**3. Atualizar `ProtectedRoute.tsx**`

- Se o usuário está autenticado mas `aprovado = false`, exibir tela de "Cadastro pendente — aguarde aprovação de um administrador" em vez de redirecionar para login
- Botão para sair (logout)

**4. Atualizar `Cadastro.tsx**`

- Após cadastro com sucesso, mostrar mensagem: "Cadastro enviado! Aguarde a aprovação de um administrador."

**5. Atualizar edge function `manage-users**`

- No GET: incluir campo `aprovado` na lista de usuários
- Nova action `approve_user`: seta `aprovado = true` no perfil do usuário

**6. Atualizar `GerenciarUsuarios.tsx**`

- Mostrar coluna "Status" (Pendente / Aprovado)
- Botão para aprovar usuários pendentes (ícone de check)
- Filtro ou destaque visual para pendentes no topo da lista

&nbsp;

&nbsp;

Gostaria também de que os atendimentos aos quais estão fora dos prazos, sejam enviados automáticamente para a página de atrasados.  Adicione Atrasados no dashboard também para podermos dá mais atenção

&nbsp;