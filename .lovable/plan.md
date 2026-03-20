

## Plano: Ajustar imagem de fundo do Login para não cortar o texto

### Problema
A imagem de fundo usa `object-cover`, que faz zoom e corta partes da imagem (incluindo textos). O painel ocupa apenas metade da tela (`lg:w-1/2`), então a imagem é bastante recortada.

### Solução
Alterar `src/pages/Login.tsx` linha 36:
- Trocar `object-cover` por `object-contain` na imagem do lado esquerdo — isso garante que a imagem inteira seja visível sem corte
- Adicionar `bg-primary` no container da imagem para preencher o espaço vazio com a cor primária do sistema (azul escuro), mantendo visual coeso
- Na versão mobile (linha 44), manter `object-cover` com altura fixa pois ali funciona bem

