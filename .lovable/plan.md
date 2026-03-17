

## Plano: Corrigir build + padronizar favicon

### Problema 1: Build quebrado
O pacote `@tiptap/starter-kit` e `@tiptap/extension-text-align` estão sendo importados no código mas **não estão no `package.json`**. Falta adicioná-los como dependências.

**Ação:** Adicionar ao `package.json`:
- `@tiptap/starter-kit: ^3.20.4`
- `@tiptap/extension-text-align: ^3.20.4`

### Problema 2: Favicon diferente
O favicon atual (`public/favicon.ico`) não é o ícone "M" usado na sidebar. O ícone da sidebar vem de `src/assets/agrm-icon.ico`.

**Ação:** Copiar `src/assets/agrm-icon.ico` para `public/favicon.ico`, substituindo o atual, para que o ícone do navegador seja o mesmo "M" do layout do sistema.

