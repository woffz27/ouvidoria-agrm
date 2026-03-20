import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2, Eye, EyeOff, User, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import cadastroBg from "@/assets/cadastro-bg.jpg";

export default function Cadastro() {
  const { signUp, user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    if (senha.length < 6) {
      toast({ title: "Erro", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await signUp(email, senha, { nome_completo: nome, cargo });
    if (error) {
      toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Cadastro enviado!", description: "Aguarde a aprovação de um administrador para acessar o sistema." });
      navigate("/login");
      return;
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img alt="" className="absolute inset-0 h-full w-full object-cover" src={cadastroBg} />
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-4 sm:p-6 md:p-8 bg-card">
        <div className="w-full max-w-md space-y-4 sm:space-y-6 md:space-y-8">
          <div className="lg:hidden flex justify-center mb-6">
            <img src={cadastroBg} alt="AGRM" className="h-32 w-auto rounded-xl object-cover" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Criar Conta</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Preencha os dados para se cadastrar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-foreground">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-foreground">Cargo</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Ex: Ouvidor, Atendente" value={cargo} onChange={(e) => setCargo(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-foreground">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-foreground">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} placeholder="Repita a senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Cadastrar
            </Button>
          </form>

          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>);

}