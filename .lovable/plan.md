## Plano: Ajustes pós-cadastro, imagens, novos campos, envio de respostas e controle de acesso

### 1. Redirecionar para login após cadastro

Em `Cadastro.tsx`, após signup com sucesso, usar `navigate("/login")` em vez de apenas mostrar toast.

### 2. Corrigir imagens pixeladas nas telas de auth

As imagens nas páginas de Login, Cadastro e Recuperar Senha estão usando arquivos de baixa resolução dos lovable-uploads. Substituir pelas imagens de alta resolução enviadas pelo usuário:

- `Login.tsx` (linha 36): trocar a imagem do lado esquerdo pelo mockup desktop enviado (`agrm_login_desktop_with_real_logo.png` — copiar para `public/lovable-uploads/` com novo nome)
- `Cadastro.tsx` (linha 48): usar a mesma imagem de alta resolução
- `RecuperarSenha.tsx` (linha 33): usar o mockup de recuperação (`agrm_forgot_password_with_real_logo_1.png`)
- Garantir que as imagens mobile também usem versões de alta resolução

### 3. Novos campos no atendimento: Ordem de Serviço (CAERN), CEP, Matrícula (imóvel CAERN)

**Migration SQL:**

- Adicionar 3 colunas à tabela `atendimentos`:
  - `ordem_servico_caern TEXT NULL` (Ordem de Serviço da CAERN)
  - `cep TEXT NULL`
  - `matricula_imovel TEXT NULL` (Matrícula do imóvel na CAERN)

**UI — NovoAtendimento.tsx:**

- Adicionar os 3 campos no formulário de criação (dentro do card "Detalhes do Atendimento")

**UI — DetalhesAtendimento.tsx:**

- Exibir os 3 campos na seção de informações
- Torná-los editáveis inline (ícone de editar, campo de input, salvar/cancelar) — criar hook `useEditarAtendimento` em `use-atendimentos.ts`

**UI — Atendimentos.tsx:**

- Opcionalmente exibir Ordem de Serviço como coluna na tabela

### 4. Enviar respostas por e-mail e WhatsApp diretamente da plataforma

**E-mail:** Criar edge function `send-response-email` que recebe email do destinatário, assunto e corpo, e envia via API. No `DetalhesAtendimento.tsx`, adicionar botão "Enviar por E-mail" ao lado de "Enviar" no comentário.

**WhatsApp:** Adicionar botão "Enviar por WhatsApp" que abre link `https://wa.me/{telefone}?text={mensagem}` em nova aba (usando a API do WhatsApp Web/Click to Chat). Formatar o telefone automaticamente.

### 5. Setar "Emanuell - Chefe de gabinete" como admin absoluto

Será necessário que o usuário Emanuell se cadastre primeiro. Após o cadastro, inserir na tabela `user_roles` a role `admin` para o user_id correspondente. Como alternativa imediata:

- Criar um trigger ou migration que automaticamente atribui role `admin` ao usuário cujo email corresponde (preciso saber o email do Emanuell)
- Ou usar o insert tool após o cadastro
  !!! Já estou cadastrado"!!!!!!!

### 6. Controle de acesso: usuários comuns vs admin

**Admin (Emanuell):** Acesso total — excluir atendimentos, alterar status, editar campos, gerenciar usuários.

**Usuários comuns:** Podem visualizar atendimentos, adicionar comentários e criar novos atendimentos. NÃO podem:

- Excluir atendimentos
- Alterar status
- Editar campos do atendimento
- Excluir/editar comentários de outros usuários

**Implementação:**

- Usar `isAdmin` do `AuthContext` para condicionar a exibição de botões de exclusão, edição de status e edição de campos
- Em `DetalhesAtendimento.tsx`: esconder botão "Excluir", select de status e edição inline para não-admins
- Em `Atendimentos.tsx`: esconder coluna de exclusão e select de status para não-admins
- No formulário de novo atendimento: manter acesso para todos

### Arquivos a criar/modificar

- Migration SQL (3 novas colunas em `atendimentos`)
- `src/pages/Cadastro.tsx` — redirect após cadastro
- `src/pages/Login.tsx` — imagem de alta resolução
- `src/pages/Cadastro.tsx` — imagem de alta resolução
- `src/pages/RecuperarSenha.tsx` — imagem de alta resolução
- `src/hooks/use-atendimentos.ts` — hook `useEditarAtendimento`
- `src/pages/NovoAtendimento.tsx` — 3 novos campos
- `src/pages/DetalhesAtendimento.tsx` — exibir/editar novos campos + botões email/WhatsApp + controle admin
- `src/pages/Atendimentos.tsx` — controle admin (esconder exclusão/status para não-admin)
- Edge function `send-response-email` (envio de email)

### Pergunta pendente

Preciso saber o **email** do Emanuell (Chefe de gabinete) para configurar automaticamente como admin no banco de dados.

emanuellleandro15@gmail.com

&nbsp;