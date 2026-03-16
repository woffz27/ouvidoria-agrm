
-- Create enums for the atendimentos
CREATE TYPE public.status_type AS ENUM ('aberto', 'em_andamento', 'respondido', 'finalizado');
CREATE TYPE public.categoria_type AS ENUM ('reclamacao', 'sugestao', 'elogio', 'solicitacao');
CREATE TYPE public.canal_type AS ENUM ('site', 'whatsapp', 'telefone');
CREATE TYPE public.tipo_problema_type AS ENUM ('extravasamento_esgoto', 'vazamento_agua', 'pavimentacao', 'outros');
CREATE TYPE public.atualizacao_tipo AS ENUM ('comentario', 'status_change');

-- Create atendimentos table
CREATE TABLE public.atendimentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  protocolo TEXT NOT NULL UNIQUE,
  solicitante TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  assunto TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria categoria_type NOT NULL,
  canal canal_type NOT NULL,
  tipo_problema tipo_problema_type NOT NULL DEFAULT 'outros',
  status status_type NOT NULL DEFAULT 'aberto',
  arquivos TEXT[],
  data_abertura TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create atualizacoes table
CREATE TABLE public.atualizacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  atendimento_id UUID NOT NULL REFERENCES public.atendimentos(id) ON DELETE CASCADE,
  usuario TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  tipo atualizacao_tipo NOT NULL DEFAULT 'comentario',
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atualizacoes ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (ouvidoria is a public-facing system, no auth required)
CREATE POLICY "Anyone can view atendimentos" ON public.atendimentos FOR SELECT USING (true);
CREATE POLICY "Anyone can create atendimentos" ON public.atendimentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update atendimentos" ON public.atendimentos FOR UPDATE USING (true);

CREATE POLICY "Anyone can view atualizacoes" ON public.atualizacoes FOR SELECT USING (true);
CREATE POLICY "Anyone can create atualizacoes" ON public.atualizacoes FOR INSERT WITH CHECK (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_atendimento_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_atendimentos_timestamp
  BEFORE UPDATE ON public.atendimentos
  FOR EACH ROW EXECUTE FUNCTION public.update_atendimento_timestamp();

-- Auto-update atendimento timestamp when atualizacao is added
CREATE OR REPLACE FUNCTION public.update_atendimento_on_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.atendimentos SET data_atualizacao = now() WHERE id = NEW.atendimento_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trigger_update_atendimento_on_atualizacao
  AFTER INSERT ON public.atualizacoes
  FOR EACH ROW EXECUTE FUNCTION public.update_atendimento_on_atualizacao();

-- Create indexes
CREATE INDEX idx_atendimentos_status ON public.atendimentos(status);
CREATE INDEX idx_atendimentos_categoria ON public.atendimentos(categoria);
CREATE INDEX idx_atendimentos_tipo_problema ON public.atendimentos(tipo_problema);
CREATE INDEX idx_atendimentos_protocolo ON public.atendimentos(protocolo);
CREATE INDEX idx_atualizacoes_atendimento ON public.atualizacoes(atendimento_id);
