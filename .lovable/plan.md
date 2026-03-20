

## Plano: Envio de WhatsApp com mensagem padrão de protocolo via wa.me

### O que será feito

Atualizar o botão "Enviar por WhatsApp" em `DetalhesAtendimento.tsx` para usar o número **84996556587** como remetente de referência e enviar a mensagem padrão de protocolo registrado via link `wa.me`.

### Alterações em `src/pages/DetalhesAtendimento.tsx`

**1. Atualizar `handleWhatsApp`** para montar a mensagem padrão com os dados do atendimento:

```
📩 Ouvidoria AGRM – Protocolo Registrado

Olá! 👋
Informamos que sua manifestação foi recebida com sucesso pela Ouvidoria da AGRM.

📄 Protocolo nº: [protocolo do atendimento]

Sua solicitação está em análise e será encaminhada ao setor responsável.

⏱️ O prazo para resposta é de até [prazo calculado] dias úteis.

📌 Guarde o número do protocolo para acompanhamento.

Agradecemos o seu contato e permanecemos à disposição.
```

- O protocolo e prazo são preenchidos automaticamente a partir dos dados do atendimento
- O número do destinatário continua sendo o telefone do solicitante cadastrado no atendimento
- O link `wa.me` abre o WhatsApp com a mensagem já preenchida

**2. Adicionar botão separado** para enviar a mensagem padrão de protocolo (distinto do botão que envia o comentário digitado), ou substituir o comportamento atual — o botão "Enviar por WhatsApp" enviará sempre a mensagem padrão de protocolo.

