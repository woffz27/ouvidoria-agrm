-- Storage bucket for attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('anexos', 'anexos', true);

-- Storage RLS policies
CREATE POLICY "Public read anexos" ON storage.objects FOR SELECT USING (bucket_id = 'anexos');
CREATE POLICY "Public upload anexos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'anexos');

-- Deadline column
ALTER TABLE public.atendimentos ADD COLUMN prazo_resolucao timestamptz;

-- Attachments on comments
ALTER TABLE public.atualizacoes ADD COLUMN arquivos text[];

-- RLS for edit/delete comments
CREATE POLICY "Anyone can update atualizacoes" ON public.atualizacoes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete atualizacoes" ON public.atualizacoes FOR DELETE USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.atendimentos;