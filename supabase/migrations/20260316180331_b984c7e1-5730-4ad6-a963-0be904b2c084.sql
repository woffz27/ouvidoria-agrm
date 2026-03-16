-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo text NOT NULL DEFAULT '',
  cargo text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo, cargo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
    COALESCE(NEW.raw_user_meta_data->>'cargo', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS on atendimentos: require authentication
DROP POLICY IF EXISTS "Anyone can view atendimentos" ON public.atendimentos;
DROP POLICY IF EXISTS "Anyone can create atendimentos" ON public.atendimentos;
DROP POLICY IF EXISTS "Anyone can update atendimentos" ON public.atendimentos;
DROP POLICY IF EXISTS "Anyone can delete atendimentos" ON public.atendimentos;

CREATE POLICY "Authenticated can view atendimentos" ON public.atendimentos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create atendimentos" ON public.atendimentos
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update atendimentos" ON public.atendimentos
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete atendimentos" ON public.atendimentos
  FOR DELETE TO authenticated USING (true);

-- Update RLS on atualizacoes: require authentication
DROP POLICY IF EXISTS "Anyone can view atualizacoes" ON public.atualizacoes;
DROP POLICY IF EXISTS "Anyone can create atualizacoes" ON public.atualizacoes;
DROP POLICY IF EXISTS "Anyone can update atualizacoes" ON public.atualizacoes;
DROP POLICY IF EXISTS "Anyone can delete atualizacoes" ON public.atualizacoes;

CREATE POLICY "Authenticated can view atualizacoes" ON public.atualizacoes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create atualizacoes" ON public.atualizacoes
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update atualizacoes" ON public.atualizacoes
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete atualizacoes" ON public.atualizacoes
  FOR DELETE TO authenticated USING (true);

-- Update profiles timestamp trigger
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atendimento_timestamp();