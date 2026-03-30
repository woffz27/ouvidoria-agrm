

## Plano: Botão "Envio para a Fiscalização" via WhatsApp

### O que será feito

Adicionar um novo botão ao lado do "Enviar Protocolo via WhatsApp" que envia uma mensagem formatada para o número fixo da fiscalização (84 99655-9562) com todos os dados preenchidos do atendimento.

### Alterações em `src/pages/DetalhesAtendimento.tsx`

**1. Nova função `handleEnvioFiscalizacao` (após linha 214)**

- Número fixo: `5584996559562`
- Monta a mensagem no formato solicitado com emojis, incluindo apenas campos preenchidos
- Campos condicionais: protocolo, ordem_servico_caern, data_abertura, solicitante, telefone, logradouro+bairro, tipo_problema, descricao, assunto
- Abre `wa.me/5584996559562?text=...` em nova aba (não depende do telefone do solicitante)

**2. Novo botão (após linha 541)**

```tsx
<Button
  size="sm"
  variant="outline"
  className="gap-1.5 w-full sm:w-auto border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
  onClick={handleEnvioFiscalizacao}
>
  <MessageSquare className="h-3.5 w-3.5" /> Envio para a Fiscalização
</Button>
```

### Formato da mensagem

Segue exatamente o modelo fornecido, com campos condicionais — se `ordem_servico_caern` estiver vazio, a linha "Protocolo CAERN" não aparece; se `logradouro` estiver vazio, o bloco de endereço não aparece, etc.

Total: **1 arquivo**, ~40 linhas adicionadas.

