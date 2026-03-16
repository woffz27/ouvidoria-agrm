

## Plano: Painel de Ouvidoria AGRM - Layout Tecnológico

### Paleta de Cores (baseada no site da AGRM)

Com base no site oficial da AGRM (agrm.mossoro.rn.gov.br), as cores identificadas são:

- **Azul escuro (primário):** `#003B7A` - header, sidebar, backgrounds
- **Azul médio:** `#0056B3` - botões, links, destaques
- **Amarelo/dourado (accent):** `#F5A623` - destaques, badges, linhas decorativas
- **Verde:** `#2E7D32` - indicadores de sucesso, status concluído
- **Branco:** `#FFFFFF` - textos sobre fundo escuro, cards
- **Cinza escuro:** `#1A1F2E` - fundo do modo "tech"

### Conceito Visual

Layout tecnológico com:
- Sidebar escura (azul escuro AGRM) com ícones e navegação
- Fundo levemente escurecido com cards brancos com bordas sutis e sombras
- Gradientes sutis azul AGRM no header
- Tipografia moderna e espaçada
- Ícones Lucide para status e navegação
- Animações de hover suaves
- Grid de cards de estatísticas com bordas coloridas (azul, amarelo, verde)

### Estrutura de Páginas

1. **Dashboard (/)** - Estatísticas + lista resumida de atendimentos recentes
2. **Atendimentos (/atendimentos)** - Tabela completa com filtros, busca, paginação
3. **Novo Atendimento (/novo-atendimento)** - Formulário com campo de canal (Site, WhatsApp, Telefone) e upload de arquivos
4. **Detalhes (/atendimento/:id)** - Informações completas com protocolo, histórico, comentários

### Arquivos a Criar/Modificar

1. **`src/index.css`** - Nova paleta AGRM com variáveis CSS customizadas
2. **`src/components/layout/Sidebar.tsx`** - Sidebar escura com logo AGRM, navegação com ícones
3. **`src/components/layout/AppLayout.tsx`** - Layout principal (sidebar + content area)
4. **`src/components/layout/Header.tsx`** - Top bar com busca por protocolo e perfil
5. **`src/pages/Dashboard.tsx`** - Cards de estatísticas + atendimentos recentes
6. **`src/pages/Atendimentos.tsx`** - Listagem completa com filtros e paginação
7. **`src/pages/NovoAtendimento.tsx`** - Formulário com canal, categoria, upload
8. **`src/pages/DetalhesAtendimento.tsx`** - Detalhes com protocolo, histórico, comentários
9. **`src/lib/mock-data.ts`** - Dados mock para demonstração
10. **`src/App.tsx`** - Rotas atualizadas

### Detalhes Técnicos

- Dados mock (sem backend por enquanto) para demonstrar o layout
- Componentes shadcn/ui existentes reutilizados (Card, Table, Badge, Input, Button, Select, Tabs)
- Lucide React para ícones (FileText, MessageSquare, BarChart3, Phone, Globe, etc.)
- Upload de arquivos com input file + preview (armazenamento local por enquanto)
- Campo de canal de atendimento: select com opções Site, WhatsApp, Telefone
- Protocolo gerado no formato `AAAA-NNNNNN` exibido nos detalhes
- Paginação na listagem de atendimentos

