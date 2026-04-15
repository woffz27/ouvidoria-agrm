
CREATE TABLE public.notificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  atendimento_id uuid NOT NULL,
  data_alerta timestamptz NOT NULL,
  justificativa text,
  lida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notificacoes"
  ON public.notificacoes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notificacoes"
  ON public.notificacoes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notificacoes"
  ON public.notificacoes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notificacoes"
  ON public.notificacoes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notificacoes;
