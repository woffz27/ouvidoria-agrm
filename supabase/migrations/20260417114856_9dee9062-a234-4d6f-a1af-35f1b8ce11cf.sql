-- Permitir que admins e ouvidores gerenciem (UPDATE/DELETE) qualquer notificação
DROP POLICY IF EXISTS "Users can update own notificacoes" ON public.notificacoes;
DROP POLICY IF EXISTS "Users can delete own notificacoes" ON public.notificacoes;

CREATE POLICY "Update notificacoes (own or admin/ouvidor)"
ON public.notificacoes
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_role(auth.uid(), 'ouvidor'::app_role)
);

CREATE POLICY "Delete notificacoes (own or admin/ouvidor)"
ON public.notificacoes
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_role(auth.uid(), 'ouvidor'::app_role)
);

-- Permitir admin/ouvidor enxergarem todas as notificações para gerenciamento
DROP POLICY IF EXISTS "Users can view own notificacoes" ON public.notificacoes;

CREATE POLICY "View notificacoes (own or admin/ouvidor)"
ON public.notificacoes
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_role(auth.uid(), 'ouvidor'::app_role)
);