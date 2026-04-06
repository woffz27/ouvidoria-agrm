
## Plano: Mover campo Telefone para abaixo do E-mail

### Alteração em `src/pages/DetalhesAtendimento.tsx`

Mover `{editableField("telefone", "Telefone", att.telefone)}` da linha 434 para logo após o array `infoItems` ser renderizado (linha 431), **antes** dos outros campos editáveis. Assim ele ficará visualmente abaixo do E-mail (que é o último item estático antes dos editáveis).

Na prática, a linha 434 já está na posição correta em relação ao `infoItems`, mas o E-mail está na posição 3 do array e depois vêm Canal, Categoria, Tipo, Data de Abertura e Última Atualização — então o telefone aparece **depois** de todos esses.

**Solução**: Mover "E-mail" para ser o último item do `infoItems` (antes de Canal ficaria errado) — ou melhor, inserir o telefone **dentro** do array `infoItems` logo após o E-mail, como item estático, e torná-lo editável ali.

A abordagem mais simples: reorganizar para que o `editableField("telefone")` seja renderizado **entre** o item E-mail e o item Canal. Para isso, vou dividir o `infoItems` em dois grupos ou inserir o campo telefone editável no meio da renderização do loop.

**Implementação concreta**:
1. Dividir `infoItems` em `infoItemsTop` (Protocolo, Solicitante, E-mail) e `infoItemsBottom` (Canal, Categoria, Tipo, Data Abertura, Última Atualização)
2. Renderizar `infoItemsTop` → `editableField("telefone")` → `infoItemsBottom` → demais campos editáveis

**1 arquivo**, ~10 linhas alteradas.
