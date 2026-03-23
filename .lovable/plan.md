

## Plano: Adicionar logotipo no cabeçalho do PDF exportado

### O que muda

**`src/pages/Atendimentos.tsx`** — Atualizar `handleExportPDF` para incluir o logotipo `login-logo.png` no topo do PDF antes do título.

### Como funciona

1. Importar `loginLogo` de `@/assets/login-logo.png`
2. Na função `handleExportPDF`, carregar a imagem como base64 usando `Image()` + canvas, e inserir com `doc.addImage()` no canto superior esquerdo
3. Reposicionar o título e subtítulo para ficar ao lado/abaixo do logo
4. Ajustar o `startY` da tabela para acomodar o logo

### Detalhes técnicos

- Converter o import do PNG para base64 via canvas no momento da geração (necessário para jsPDF)
- Logo posicionado no topo esquerdo (~30x30px no PDF), título ao lado
- Tabela começa após o cabeçalho com logo

Total: **1 arquivo** alterado, ~15 linhas adicionadas.

