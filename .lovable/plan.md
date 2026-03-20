

## Plano: Novo tema de cores — Tecnológico e Inovador

### Direção visual

Manter a identidade AGRM (azul institucional + ouro) mas modernizar com:
- **Azul mais profundo e saturado** como primário, com gradientes sutis
- **Ciano/teal** como cor secundária (ar tecnológico e inovador)
- **Ouro mais refinado** (tom âmbar dourado) como acento
- **Backgrounds mais limpos** com tons slate em vez de cinza neutro
- **Sidebar escura** (slate/navy profundo) para contraste premium

### Paleta proposta

```text
Primário:     #0F2B5B → azul marinho profundo (mantém identidade)
Secundário:   #0EA5E9 → ciano vibrante (toque tech/inovador)
Acento:       #F59E0B → âmbar dourado (refinado)
Sucesso:      #10B981 → verde esmeralda
Destrutivo:   #EF4444 → vermelho
Background:   #F8FAFC → slate-50 (mais limpo)
Card:         #FFFFFF → branco puro para cards
Sidebar:      #0C1E3A → navy escuro profundo
Sidebar hover:#1A3A5C → navy médio
```

### Alterações

**1. `src/index.css`** — Atualizar todas as variáveis CSS (`:root` e `.dark`):
- Backgrounds mais claros e limpos (slate-based)
- Primário azul profundo, secundário ciano tech
- Sidebar com navy escuro e acentos ciano
- Melhor contraste geral

**2. `src/index.css`** — Atualizar utilitários (`.tech-glow`, `.gradient-primary`):
- Gradientes atualizados com as novas cores
- Glow effect com ciano

**3. `tailwind.config.ts`** — Sem alterações estruturais necessárias (usa variáveis CSS)

**4. Componentes** — Sem alterações necessárias (já usam as variáveis do tema)

Total: **1 arquivo alterado** (`src/index.css`)

