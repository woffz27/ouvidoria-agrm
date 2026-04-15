import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, AlertCircle, CheckCircle2, Loader2, Phone, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/layout/AppLayout";
import { statusLabels, categoriaLabels, canalLabels } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import type { Atendimento } from "@/hooks/use-atendimentos";

function normalizeTelefone(tel: string): string {
  let clean = tel.replace(/\D/g, "");
  if (clean.startsWith("55") && clean.length > 11) clean = clean.substring(2);
  return clean;
}

export default function BuscarProtocolo() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [tab, setTab] = useState<"protocolo" | "telefone">("protocolo");
  const [busca, setBusca] = useState(initialQuery);
  const [resultado, setResultado] = useState<Atendimento | null>(null);
  const [resultados, setResultados] = useState<Atendimento[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce for phone search
  const [debouncedPhone, setDebouncedPhone] = useState("");
  useEffect(() => {
    if (tab !== "telefone") return;
    const timer = setTimeout(() => setDebouncedPhone(busca), 300);
    return () => clearTimeout(timer);
  }, [busca, tab]);

  const searchByPhone = useCallback(async (phone: string) => {
    const normalized = normalizeTelefone(phone);
    if (normalized.length < 8) { setResultados([]); setBuscou(false); return; }
    setLoading(true);
    try {
      const { data } = await supabase
        .from("atendimentos")
        .select("*")
        .ilike("telefone", `%${normalized}%`)
        .order("data_abertura", { ascending: false })
        .limit(50);
      setResultados(data || []);
    } catch {
      setResultados([]);
    }
    setBuscou(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "telefone" && debouncedPhone.trim()) {
      searchByPhone(debouncedPhone);
    }
  }, [debouncedPhone, tab, searchByPhone]);

  const handleSearchProtocolo = async (e: React.FormEvent) => {
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

  const handleTabChange = (value: string) => {
    setTab(value as "protocolo" | "telefone");
    setBusca("");
    setResultado(null);
    setResultados([]);
    setBuscou(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Buscar Atendimento</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Localize atendimentos por protocolo ou telefone
          </p>
        </div>

        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="protocolo" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Protocolo
            </TabsTrigger>
            <TabsTrigger value="telefone" className="gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Telefone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="protocolo" className="space-y-4 mt-4">
            <form onSubmit={handleSearchProtocolo} className="flex gap-2">
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
          </TabsContent>

          <TabsContent value="telefone" className="space-y-4 mt-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="(84) 99999-9999 ou 84999999999"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {buscou && !loading && resultados.length === 0 && (
              <Card className="border-destructive/30">
                <CardContent className="flex items-center gap-3 py-8 justify-center">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum atendimento encontrado para este telefone.
                  </p>
                </CardContent>
              </Card>
            )}

            {resultados.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{resultados.length} resultado{resultados.length > 1 ? "s" : ""}</p>
                {resultados.map((a) => (
                  <Link key={a.id} to={`/atendimento/${a.id}`} className="block">
                    <Card className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-mono text-xs font-semibold text-primary">{a.protocolo}</p>
                            <p className="text-sm font-medium mt-0.5">{a.solicitante}</p>
                            <p className="text-xs text-muted-foreground truncate">{a.assunto}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge className="text-[10px]">{statusLabels[a.status]}</Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(a.data_abertura).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
