

## Plano: Corrigir emojis no "Enviar Protocolo via WhatsApp"

### Problema

A função `handleWhatsAppProtocolo` usa um helper `E()` com `.normalize("NFC")` que ainda resulta em emojis corrompidos (`�`). Enquanto isso, a função `handleEnvioFiscalizacao` funciona corretamente usando constantes individuais com `String.fromCodePoint` **sem** `.normalize("NFC")`.

### Solução

Reescrever `handleWhatsAppProtocolo` (linhas 188-217) usando o mesmo padrão que funciona em `handleEnvioFiscalizacao`: constantes individuais sem `.normalize("NFC")`.

```typescript
const CLIP = String.fromCodePoint(0x1F4CB);
const WAVE = String.fromCodePoint(0x1F44B);
const NUM = String.fromCodePoint(0x1F522);
const CAL = String.fromCodePoint(0x1F4C5);
const FOLDER = String.fromCodePoint(0x1F4C2);
const WARN = String.fromCodePoint(0x26A0, 0xFE0F);
const SAT = String.fromCodePoint(0x1F4E1);
const LOC = String.fromCodePoint(0x1F4CD);
const HOUR = String.fromCodePoint(0x231B);
const CHECK = String.fromCodePoint(0x2705);
```

Depois montar a mensagem com essas constantes diretamente no template literal, igual ao padrão da fiscalização.

**1 arquivo**, ~30 linhas alteradas.

