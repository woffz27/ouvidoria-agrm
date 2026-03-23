

## Plano: Usar logo AGRM_1.png no cabeçalho do PDF exportado

### O que muda

O PDF atual já usa `login-logo.png` no cabeçalho. O usuário enviou uma nova imagem (`AGRM_1.png`) com o logo completo da AGRM (com texto "Agência Reguladora dos Serviços Públicos de Mossoró") para substituir no PDF.

### Alterações

**1. Copiar o novo logo para `src/assets/agrm-pdf-logo.png`**

**2. `src/pages/Atendimentos.tsx`**
- Alterar o import do logo de `login-logo.png` para `agrm-pdf-logo.png`
- O restante da lógica de geração do PDF permanece igual (logo no topo esquerdo, título ao lado, tabela abaixo)

Total: **1 arquivo** alterado + 1 asset adicionado.

