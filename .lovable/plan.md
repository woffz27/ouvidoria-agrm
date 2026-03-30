
Objetivo: corrigir definitivamente a quebra dos emojis no botão **“Envio para a Fiscalização”** mantendo o envio por link direto do WhatsApp.

1) Ajustar a geração dos emojis para máxima compatibilidade  
- Arquivo: `src/pages/DetalhesAtendimento.tsx`  
- Na `handleEnvioFiscalizacao`, substituir os escapes `\u{...}` por constantes geradas em runtime com `String.fromCodePoint(...)` (ex.: `PIN`, `DOC`, `CAL`, `USER`, etc.).  
- Isso evita qualquer problema de parser/transpilação/encoding de arquivo para caracteres fora do BMP.

2) Reforçar codificação UTF-8 antes do link  
- Montar a mensagem final com `linhas.join("\n").normalize("NFC")`.  
- Continuar usando `encodeURIComponent` no texto da mensagem.  
- Manter a regra atual: incluir apenas campos preenchidos.

3) Melhorar compatibilidade do link de abertura do WhatsApp  
- Trocar o endpoint principal para `https://api.whatsapp.com/send?phone=5584996559562&text=...` (mais tolerante em alguns ambientes).  
- Manter fallback para `https://wa.me/5584996559562?text=...` caso necessário.

4) Preservar o layout da mensagem já aprovado  
- Cabeçalho “ENVIO PARA FISCALIZAÇÃO”, separadores e blocos condicionais permanecem.  
- Não alterar conteúdo funcional (somente robustez de encoding dos ícones).

Detalhes técnicos (resumo)
- Arquivo alterado: `src/pages/DetalhesAtendimento.tsx`  
- Escopo: somente `handleEnvioFiscalizacao` (e utilitários locais pequenos dentro dela)  
- Impacto: baixo risco, sem mudanças em banco/autenticação/rotas.
