

## Plano: Melhorar mensagem pré-preenchida do WhatsApp com mais detalhes

### O que muda

Apenas a mensagem no `handleWhatsAppProtocolo` em `src/pages/DetalhesAtendimento.tsx` (linhas 186-202). A mensagem atual inclui protocolo e prazo. Será enriquecida com:

- **Nome do solicitante**
- **Categoria** (Reclamação, Sugestão, etc.)
- **Tipo de problema** (Extravasamento, Vazamento, etc.)
- **Canal de entrada** (Site, WhatsApp, Telefone)
- **Data de abertura** formatada
- **Endereço/Bairro** (se preenchidos)
- **Resumo da descrição** (primeiros 150 caracteres)

### Arquivo alterado

**`src/pages/DetalhesAtendimento.tsx`** — Atualizar a função `handleWhatsAppProtocolo` para compor uma mensagem mais completa usando os labels já existentes (`categoriaLabels`, `tipoProblemaLabels`, `canalLabels`) e os campos do atendimento.

### Exemplo da nova mensagem

```text
*Ouvidoria AGRM - Protocolo Registrado*

Olá, João Silva!
Informamos que sua manifestação foi recebida com sucesso.

*Protocolo nº:* 2025-000123
*Data de abertura:* 20/03/2025, 14:30
*Categoria:* Reclamação
*Tipo:* Vazamento de Água
*Canal:* WhatsApp
*Local:* Rua das Flores, 123 - Centro

*Resumo:* Vazamento na esquina da rua principal...

Sua solicitação está em análise e será encaminhada ao setor responsável.

*Prazo para resposta:* até 15 dias úteis.

Guarde o número do protocolo para acompanhamento.
Agradecemos o seu contato e permanecemos à disposição.
```

Total: **1 arquivo**, ~20 linhas alteradas.

