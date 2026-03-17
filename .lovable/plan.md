

## Plano: Editor de texto rico nos comentários + campo de destinatário de email

### 1. Instalar TipTap (editor de texto rico)
- Adicionar dependências: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-text-align`, `@tiptap/extension-link`, `@tiptap/extension-color`, `@tiptap/extension-text-style`, `@tiptap/extension-image`
- TipTap é leve, modular e funciona perfeitamente com React — diferente do CKEditor que é pesado e tem problemas de licença

### 2. Criar componente `RichTextEditor`
- Novo arquivo `src/components/ui/rich-text-editor.tsx`
- Toolbar com todos os botões da imagem de referência:
  - **Formatação**: Negrito, Itálico, Sublinhado, Tachado, Subscrito, Sobrescrito
  - **Alinhamento**: Esquerda, Centro, Direita, Justificado
  - **Listas**: Ordenada, Não-ordenada
  - **Inserir**: Link, Imagem (upload), Tabela
  - **Histórico**: Desfazer, Refazer
  - **Cabeçalhos**: H1-H3 via dropdown
  - **Cores**: Cor do texto
  - **Citação**: Bloco de citação
  - **Código fonte**: Visualizar HTML bruto
- O editor retorna HTML via `onUpdate`
- Estilização consistente com o design do sistema (shadcn/tailwind)

### 3. Atualizar `DetalhesAtendimento.tsx`
- Substituir o `<Textarea>` de "Adicionar Comentário" pelo novo `RichTextEditor`
- Substituir o `<Textarea>` de edição de comentário existente pelo `RichTextEditor`
- Exibir comentários salvos com `dangerouslySetInnerHTML` (sanitizado com DOMPurify)
- Adicionar campo **"Destinatário (email)"** ao lado do botão "Enviar por E-mail":
  - Input de email pré-preenchido com o email do solicitante (se disponível)
  - Editável para o usuário digitar outro destinatário

### 4. Edge function `send-email` para envio real de email
- Criar edge function que usa a Lovable AI API para enviar emails de fato (em vez de `mailto:`)
- Recebe: `to`, `subject`, `html_body`
- Valida que o chamador está autenticado
- Alternativa: manter o `mailto:` mas com HTML convertido para texto plano, e adicionar o campo de destinatário editável

### 5. Armazenar HTML no banco
- O campo `conteudo` em `atualizacoes` já é `text` — basta salvar o HTML gerado pelo editor
- Na exibição, renderizar o HTML com sanitização (DOMPurify)

### Segurança
- Instalar `dompurify` + `@types/dompurify` para sanitizar HTML antes de renderizar
- Nunca renderizar HTML não sanitizado

