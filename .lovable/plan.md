

## Plano: 3 correções rápidas

### 1. Exportar PDF — implementar funcionalidade
O botão "Exportar PDF" na página de Atendimentos (linha 102) não tem `onClick` — é apenas visual. Implementar a geração de PDF usando `jspdf` + `jspdf-autotable` para exportar a lista filtrada de atendimentos em formato tabular.

**`src/pages/Atendimentos.tsx`**:
- Instalar `jspdf` e `jspdf-autotable`
- Criar função `handleExportPDF` que gera um PDF com cabeçalho "Relatório de Atendimentos - Ouvidoria AGRM", tabela com colunas (Protocolo, Solicitante, Assunto, Categoria, Status, Data) usando os dados filtrados
- Conectar ao `onClick` do botão

### 2. Remover botão "Novo" ao lado de "Exportar PDF"
**`src/pages/Atendimentos.tsx`** (linhas 105-109): Remover o `<Link to="/novo-atendimento">` e o `<Button>` "Novo".

### 3. Remover "Resumo" da mensagem WhatsApp
**`src/pages/DetalhesAtendimento.tsx`** (linhas 195-197, 210): Remover as variáveis e a linha `*Resumo:* ${resumo}` da mensagem pré-preenchida.

Total: **2 arquivos** alterados + 1 dependência (`jspdf`, `jspdf-autotable`).

