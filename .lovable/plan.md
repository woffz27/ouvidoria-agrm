

## Plano: Substituir imagens das telas de autenticação por versões em alta resolução

Cada tela de auth receberá sua imagem específica (em vez de compartilhar uma única `login-bg.png`):

### Arquivos de imagem
- Copiar `user-uploads://Painel_login_ouvidoria.jpg` → `src/assets/login-bg.jpg`
- Copiar `user-uploads://cadastro_usuario.jpg` → `src/assets/cadastro-bg.jpg`
- Copiar `user-uploads://Recuperar_acesso.jpg` → `src/assets/recuperar-bg.jpg`

### Alterações nos componentes
- **`Login.tsx`**: importar `login-bg.jpg` e usar no lado esquerdo (desktop) e topo (mobile)
- **`Cadastro.tsx`**: importar `cadastro-bg.jpg` e usar no lado esquerdo/topo
- **`RecuperarSenha.tsx`**: importar `recuperar-bg.jpg` e usar no lado esquerdo/topo
- Remover o antigo `login-bg.png` se não for mais usado

