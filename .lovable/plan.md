

## Plano: Substituir emojis incompatíveis na mensagem de WhatsApp

### Problema
Os emojis `📩`, `👋`, `📄`, `⏱️`, `📌` usados na mensagem podem não renderizar corretamente no WhatsApp dependendo do dispositivo/encoding da URL.

### Solução
Alterar `src/pages/DetalhesAtendimento.tsx` (linhas 188-201) — substituir os emojis por caracteres compatíveis com WhatsApp ou removê-los, usando formatação com asteriscos (`*texto*`) para negrito no WhatsApp:

```
*Ouvidoria AGRM - Protocolo Registrado*

Olá!
Informamos que sua manifestação foi recebida com sucesso pela Ouvidoria da AGRM.

*Protocolo nº:* ${protocolo}

Sua solicitação está em análise e será encaminhada ao setor responsável para as devidas providências.

*Prazo para resposta:* até ${prazo} dias úteis, podendo ser concluído antes desse período.

Guarde o número do protocolo para acompanhamento.

Agradecemos o seu contato e permanecemos à disposição.
```

Usa formatação nativa do WhatsApp (`*negrito*`) em vez de emojis, garantindo compatibilidade total.

