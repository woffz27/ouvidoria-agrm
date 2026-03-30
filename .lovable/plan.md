

## Plano: Corrigir emojis na mensagem da fiscalização

### Problema

Os emojis literais (📌, 📄, 📅, etc.) no código-fonte estão sendo corrompidos, aparecendo como `�` na mensagem do WhatsApp. Isso ocorre por problemas de encoding do arquivo.

### Solução

Substituir os emojis literais por suas sequências Unicode escape (`\u{1F4CC}`, `\u{1F4C4}`, etc.) na função `handleEnvioFiscalizacao` em `src/pages/DetalhesAtendimento.tsx` (linhas 225-237).

### Mapeamento dos emojis

| Literal | Escape | Uso |
|---------|--------|-----|
| 📌 | `\u{1F4CC}` | Título |
| 📄 | `\u{1F4C4}` | Protocolo |
| 📅 | `\u{1F4C5}` | Data |
| 👤 | `\u{1F464}` | Solicitante |
| 📞 | `\u{1F4DE}` | Telefone |
| 📍 | `\u{1F4CD}` | Endereço |
| ⚠️ | `\u26A0\uFE0F` | Tipo ocorrência |
| 📝 | `\u{1F4DD}` | Descrição |
| 📎 | `\u{1F4CE}` | Assunto |

Total: **1 arquivo**, ~13 linhas alteradas (mesmas linhas, só substituição de caracteres).

