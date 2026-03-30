

## Plano: Adicionar emojis ao "Enviar Protocolo via WhatsApp"

### O que será feito

Aplicar a mesma técnica de `String.fromCodePoint` usada na mensagem de fiscalização à mensagem de protocolo enviada ao contribuinte (`handleWhatsAppProtocolo`).

### Alteração em `src/pages/DetalhesAtendimento.tsx`

**Função `handleWhatsAppProtocolo` (linhas 188-216)** — reescrever a montagem da mensagem usando emojis via `String.fromCodePoint`:

| Emoji | Código | Uso |
|-------|--------|-----|
| 📋 | `0x1F4CB` | Cabeçalho "Protocolo Registrado" |
| 👋 | `0x1F44B` | Saudação |
| 🔢 | `0x1F522` | Protocolo nº |
| 📅 | `0x1F4C5` | Data de abertura |
| 📂 | `0x1F4C2` | Categoria |
| ⚠️ | `0x26A0 + 0xFE0F` | Tipo |
| 📡 | `0x1F4E1` | Canal |
| 📍 | `0x1F4CD` | Local |
| ⏳ | `0x231B` | Prazo |
| ✅ | `0x2705` | Guarde o protocolo |

A mensagem mantém o mesmo conteúdo textual, apenas adicionando emojis no início de cada linha, usando `String.fromCodePoint` + `.normalize("NFC")` para garantir compatibilidade.

**1 arquivo**, ~30 linhas alteradas (mesma função).

