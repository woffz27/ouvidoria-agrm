

## Plano: Tornar o campo Telefone editável para Ouvidor e Admin

### O que será feito

Mover o campo "Telefone" da lista estática `infoItems` para usar o helper `editableField`, permitindo edição inline por Ouvidores e Admins — no mesmo padrão dos campos logradouro, bairro, CEP, etc.

### Alteração em `src/pages/DetalhesAtendimento.tsx`

1. **Remover "Telefone" do array `infoItems`** (linha 336) — para que não seja renderizado como campo estático

2. **Adicionar `editableField("telefone", "Telefone", att.telefone)`** junto aos outros campos editáveis (após os campos de solicitante, antes do endereço), com ícone Phone em vez de FileText — ou manter o FileText padrão para consistência

O helper `editableField` já verifica `canEditFields` (Admin ou Ouvidor) para mostrar o botão de edição, então não é necessário nenhum ajuste de permissão.

**1 arquivo**, ~3 linhas alteradas.

