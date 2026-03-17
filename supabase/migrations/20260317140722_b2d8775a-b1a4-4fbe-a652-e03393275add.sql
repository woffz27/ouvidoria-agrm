
ALTER TABLE public.atendimentos ADD COLUMN IF NOT EXISTS ordem_servico_caern TEXT NULL;
ALTER TABLE public.atendimentos ADD COLUMN IF NOT EXISTS cep TEXT NULL;
ALTER TABLE public.atendimentos ADD COLUMN IF NOT EXISTS matricula_imovel TEXT NULL;
