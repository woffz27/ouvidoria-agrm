

## Plano: 7 Melhorias no Sistema de Ouvidoria

### 1. Upload real de arquivos (Novo Atendimento + Comentários)

**Banco de dados:**
- Criar bucket `anexos` no Storage (público para leitura)
- RLS no Storage: permitir upload e leitura pública
- Adicionar coluna `arquivos` (text[]) na tabela `atualizacoes` para anexos em comentários

**Frontend - NovoAtendimento.tsx:**
- Corrigir a área de upload: usar `<label>` como container clicável (resolver o problema de só funcionar em áreas específicas)
- No submit, fazer upload dos arquivos para o bucket `anexos`, salvar as URLs públicas no campo `arquivos` do atendimento

**Frontend - DetalhesAtendimento.tsx:**
- Exibir arquivos anexados do atendimento (thumbnails para imagens, links para documentos)
- Adicionar input de arquivo na seção de comentários
- Upload dos anexos do comentário ao enviar

### 2. Atualização em tempo real

**Banco de dados:**
- `ALTER PUBLICATION supabase_realtime ADD TABLE public.atendimentos;`

**Frontend - use-atendimentos.ts:**
- No `useAtendimentos`, adicionar subscription Supabase Realtime no canal `atendimentos`
- Ao receber evento INSERT/UPDATE/DELETE, invalidar as queries `["atendimentos"]` e `["estatisticas"]` automaticamente

### 3. Prazo de resolução e filtro de atrasados

**Banco de dados:**
- Adicionar coluna `prazo_resolucao` (timestamp with time zone, nullable) na tabela `atendimentos`

**Frontend - NovoAtendimento.tsx:**
- Adicionar campo date picker para definir prazo

**Frontend - Atendimentos.tsx:**
- Adicionar filtro "Atrasados" que mostra atendimentos com `prazo_resolucao < now()` e status diferente de `finalizado`
- Indicar visualmente (badge vermelha) atendimentos atrasados

**Frontend - DetalhesAtendimento.tsx:**
- Exibir prazo nas informações laterais

### 4. Edição e exclusão de comentários

**Banco de dados:**
- Adicionar RLS policy para UPDATE e DELETE na tabela `atualizacoes` (público por enquanto, sem auth)

**Frontend - use-atendimentos.ts:**
- Criar hooks `useEditarComentario` e `useExcluirComentario`

**Frontend - DetalhesAtendimento.tsx:**
- Adicionar botões editar/excluir em cada comentário
- Modo de edição: transforma texto em textarea editável com botões Salvar/Cancelar
- Exclusão com confirmação via dialog

### 5. Área de upload responsiva (clicável em qualquer lugar)

**Frontend - NovoAtendimento.tsx:**
- Refatorar a área de upload: usar um `<label htmlFor="file-input">` como wrapper de toda a área dashed-border
- O `<input type="file">` fica hidden, e o label cobre toda a área, tornando-a clicável em qualquer ponto

### 6. Gerenciar status dos atendimentos

**Frontend - DetalhesAtendimento.tsx:**
- Nas informações laterais, substituir o badge de status por um `Select` que permite alterar o status (aberto → em_andamento → respondido → finalizado)
- Ao alterar, fazer UPDATE no banco e criar uma `atualizacao` de tipo `status_change`

**Frontend - use-atendimentos.ts:**
- Criar hook `useAlterarStatus` (mutation que atualiza status + insere atualizacao)

**Frontend - Atendimentos.tsx:**
- Na coluna "Status" da tabela, adicionar dropdown inline para alteração rápida

### 7. Anexos nos comentários

Já coberto no item 1: adicionar campo de upload na área de comentários do `DetalhesAtendimento.tsx`, salvar URLs no campo `arquivos` da tabela `atualizacoes`, e exibir os anexos junto ao texto do comentário.

---

### Resumo das migrações SQL necessárias

```sql
-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('anexos', 'anexos', true);

-- Storage RLS
CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'anexos');
CREATE POLICY "Public upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'anexos');

-- Prazo de resolução
ALTER TABLE public.atendimentos ADD COLUMN prazo_resolucao timestamptz;

-- Anexos em comentários
ALTER TABLE public.atualizacoes ADD COLUMN arquivos text[];

-- RLS para editar/excluir comentários
CREATE POLICY "Anyone can update atualizacoes" ON public.atualizacoes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete atualizacoes" ON public.atualizacoes FOR DELETE USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.atendimentos;
```

### Arquivos a modificar
- `src/hooks/use-atendimentos.ts` — novos hooks + realtime subscription
- `src/pages/NovoAtendimento.tsx` — upload real, prazo, área clicável
- `src/pages/DetalhesAtendimento.tsx` — exibir anexos, editar/excluir comentários, alterar status, anexos em comentários
- `src/pages/Atendimentos.tsx` — filtro atrasados, alteração de status inline
- `src/lib/mock-data.ts` — (sem mudança estrutural)

