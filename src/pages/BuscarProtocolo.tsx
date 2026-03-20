import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/AppLayout";
import { statusLabels, categoriaLabels, canalLabels } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import type { Atendimento } from "@/hooks/use-atendimentos";

export default function BuscarProtocolo() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [busca, setBusca] = useState(initialQuery);
  const [resultado, setResultado] = useState<Atendimento | null>(null);
  const [buscou, setBuscou] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await supabase
        .from("atendimentos")
        .select("*")
        .eq("protocolo", busca.trim())
        .maybeSingle();
      setResultado(data);
    } catch {
      setResultado(null);
    }
    setBuscou(true);
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Buscar Protocolo</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Informe o número do protocolo no formato AAAA-NNNNNN
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ex: 2025-000001"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9 font-mono"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
          </Button>
        </form>

        {buscou && !resultado && !loading && (
          <Card className="border-destructive/30">
            <CardContent className="flex items-center gap-3 py-8 justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-muted-foreground">
                Nenhum atendimento encontrado para o protocolo informado.
              </p>
            </CardContent>
          </Card>
        )}

        {resultado && (
          <Card className="border-success/30 tech-glow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm font-semibold">Atendimento encontrado</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Protocolo</span>
                  <p className="font-mono font-bold text-primary">{resultado.protocolo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Solicitante</span>
                  <p className="font-medium">{resultado.solicitante}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Categoria</span>
                  <p>{categoriaLabels[resultado.categoria]}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Canal</span>
                  <p>{canalLabels[resultado.canal]}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Assunto</span>
                  <p>{resultado.assunto}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Status</span>
                  <Badge className="mt-1">{statusLabels[resultado.status]}</Badge>
                </div>
              </div>
              <Link to={`/atendimento/${resultado.id}`}>
                <Button size="sm" className="w-full mt-2">Ver Detalhes Completos</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
