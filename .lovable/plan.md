
## Plano: aplicar exatamente a mesma estratégia de “Envio para a Fiscalização” no “Enviar Protocolo via WhatsApp”

### Diagnóstico
O ajuste anterior copiou apenas os `String.fromCodePoint`, mas **não replicou o fluxo completo** que já funciona na fiscalização.

Hoje há uma diferença importante:
- `handleWhatsAppProtocolo` monta a mensagem em **template literal grande** e envia via helper `handleWhatsApp(...)` usando `wa.me`
- `handleEnvioFiscalizacao` monta em **array de linhas**, faz `join("\n").normalize("NFC")` e abre o link direto via `api.whatsapp.com/send`

Como o botão da fiscalização já está estável, vou alinhar o botão de protocolo ao **mesmo padrão, sem variações**.

### O que vou alterar

1. **Reescrever `handleWhatsAppProtocolo`**
- Arquivo: `src/pages/DetalhesAtendimento.tsx`
- Trocar a montagem em template literal por:
  - constantes de emoji com `String.fromCodePoint(...)`
  - `const linhas: string[] = []`
  - `linhas.push(...)` para cada bloco da mensagem
  - `const mensagem = linhas.join("\n").normalize("NFC")`

2. **Usar o mesmo link/abertura da fiscalização**
- Em vez de reutilizar `handleWhatsApp(mensagem)`, o protocolo vai abrir diretamente:
```ts
https://api.whatsapp.com/send?phone=${telFormatted}&text=${encodeURIComponent(mensagem)}
```
- Isso elimina a diferença entre `wa.me` e `api.whatsapp.com/send`

3. **Padronizar o texto como no botão funcional**
- Manter o conteúdo da mensagem
- Se necessário, escrever os trechos com acentos usando escapes Unicode (`\u00E7`, `\u00E3`, etc.) nos rótulos fixos para evitar qualquer ruído de encoding no arquivo-fonte

4. **Preservar o restante do comportamento**
- Validação de telefone continua igual
- Campos condicionais como “Local” continuam aparecendo só quando existirem
- Não mexer no envio de comentário por WhatsApp nem no botão de fiscalização

### Resultado esperado
O botão **“Enviar Protocolo via WhatsApp”** passará a usar a mesma cadeia que já deu certo no **“Envio para a Fiscalização”**:
```text
emoji runtime + linhas[] + join("\n") + normalize("NFC") + api.whatsapp.com/send
```

### Arquivo afetado
- `src/pages/DetalhesAtendimento.tsx`

### Impacto
- Baixo risco
- Sem mudanças em banco, autenticação ou rotas
- Correção isolada no envio do protocolo por WhatsApp
