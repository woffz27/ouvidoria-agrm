

## Plano: Atualizar tela de Login com novo background e logo AGRM

### O que será feito

Usar as duas imagens enviadas para compor o lado esquerdo da tela de login:
- **Background**: imagem azul escuro com gotas d'água (`background_site_ouvidoria.png`)
- **Logo**: texto "AGRM" com fundo transparente (`layout_site_ouvidoria.png`) centralizado sobre o background

### Alterações

**1. Copiar imagens para `src/assets/`**
- `background_site_ouvidoria.png` → `src/assets/login-bg-new.png`
- `layout_site_ouvidoria.png` → `src/assets/login-logo.png`

**2. Atualizar `src/pages/Login.tsx`**
- Substituir a imagem única por uma composição em camadas:
  - Background como `img` com `object-cover` (preenchendo todo o painel)
  - Logo centralizado sobre o background com `absolute` + `flex items-center justify-center`
- Atualizar a versão mobile para usar o mesmo background + logo em escala menor

