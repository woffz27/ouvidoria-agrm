

## Plano: Adicionar Tipo de Problema aos Atendimentos

### O que muda

Adicionar um novo campo `tipo_problema` ao modelo de dados, com os valores: **Extravasamento de Esgoto**, **Vazamento de Água**, **Pavimentação** e **Outros**. Atualizar os mock data com simulações realistas desses problemas.

### Arquivos a modificar

1. **`src/lib/mock-data.ts`**
   - Criar tipo `TipoProblemaType` com valores: `extravasamento_esgoto`, `vazamento_agua`, `pavimentacao`, `outros`
   - Criar `tipoProblemaLabels` com os nomes legíveis
   - Adicionar campo `tipo_problema` à interface `Atendimento`
   - Atualizar os 8 mock existentes com tipos de problema coerentes
   - Adicionar 4-6 novos registros simulando cada tipo de problema com descrições realistas (endereços de Mossoró, datas recentes, diferentes status e canais)
   - Atualizar `getEstatisticas()` para incluir distribuição por tipo de problema

2. **`src/pages/NovoAtendimento.tsx`**
   - Adicionar campo Select "Tipo de Problema" no formulário (ao lado de Categoria)

3. **`src/pages/Atendimentos.tsx`**
   - Adicionar coluna "Tipo" na tabela de listagem
   - Adicionar filtro por tipo de problema

4. **`src/pages/DetalhesAtendimento.tsx`**
   - Exibir o tipo de problema nas informações do atendimento

5. **`src/pages/Dashboard.tsx`**
   - Adicionar card ou seção mostrando distribuição por tipo de problema

### Simulações a criar

- Extravasamento de esgoto na Av. Presidente Dutra
- Vazamento de água no bairro Nova Betânia  
- Problema de pavimentação na Rua Coronel Gurgel
- Outros: solicitação de religação, dúvida sobre tarifa, etc.

