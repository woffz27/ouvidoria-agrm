

## Plano: Substituir iniciais por foto de perfil + painel admin para gerenciar fotos

### O que será feito

1. **Substituir o ícone de iniciais por foto** no Header e no Sidebar, usando o campo `avatar_url` já existente na tabela `profiles`
2. **Criar página/seção de configurações** onde o admin pode alterar a foto de qualquer usuário
3. **Upload de fotos** usando o bucket de storage existente (`anexos`) ou um novo bucket `avatars`

### Alterações

**1. Migração: criar bucket `avatars`**
- Bucket público para armazenar fotos de perfil
- RLS: admins podem fazer upload/delete; usuários podem ler

**2. `src/components/layout/Header.tsx`**
- Substituir o `<div>` com iniciais por `<Avatar>` (componente já existe em `ui/avatar.tsx`)
- Se `profile.avatar_url` existir, mostrar `<AvatarImage>`; senão, mostrar `<AvatarFallback>` com as iniciais

**3. `src/components/layout/Sidebar.tsx`**
- Mesma substituição: trocar `<div>` de iniciais no footer por `<Avatar>` com fallback

**4. `src/pages/GerenciarUsuarios.tsx`**
- Adicionar coluna/campo "Foto" na listagem de usuários
- Botão de upload de foto em cada usuário (ícone de câmera)
- Ao clicar, abre dialog com input de arquivo (aceitar imagens)
- Upload vai para `avatars/{user_id}.jpg` no Storage
- Após upload, atualiza `profiles.avatar_url` via edge function `manage-users` (nova action `update_avatar`)

**5. `supabase/functions/manage-users/index.ts`**
- Adicionar action `update_avatar` que recebe `user_id` e `avatar_url` e atualiza o campo na tabela `profiles` (usando service role)

**6. `src/contexts/AuthContext.tsx`**
- Já carrega `avatar_url` do profile — nenhuma alteração necessária

### Fluxo

1. Admin acessa "Gerenciar Usuários"
2. Clica no ícone de câmera ao lado do nome do usuário
3. Seleciona uma imagem → upload para Storage bucket `avatars`
4. URL pública é salva em `profiles.avatar_url` via edge function
5. Header e Sidebar exibem a foto automaticamente (para o próprio usuário logado, via `profile.avatar_url`)

### Arquivos alterados
- 1 migração SQL (bucket `avatars` + policies)
- `src/components/layout/Header.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/pages/GerenciarUsuarios.tsx`
- `supabase/functions/manage-users/index.ts`

