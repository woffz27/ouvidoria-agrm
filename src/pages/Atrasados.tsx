import { useState, useMemo } from "react";
import {
  CalendarClock, Search, AlertCircle, Clock, MessageCircle,
  CheckCircle2, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  statusLabels, categoriaLabels, canalLabels, tipoProblemaLabels,
  type StatusType, type CategoriaType,
} from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { useAtendimentos, useAlterarStatus } from "@/hooks/use-atendimentos";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const statusColors: Record<string, string> = {
  aberto: "bg-accent text-accent-foreground",
  em_andamento: "bg-blue-600 text-white",
  respondido: "bg-primary text-primary-foreground",
  finalizado: "bg-success text-success-foreground",
};

const statusIcons: Record<string, React.ReactNode> = {
  aberto: <AlertCircle className="h-3.5 w-3.5" />,
  em_andamento: <Clock className="h-3.5 w-3.5" />,
  respondido: <MessageCircle className="h-3.5 w-3.5" />,
  finalizado: <CheckCircle2 className="h-3.5 w-3.5" />,
};

const ITEMS_PER_PAGE = 10;

export default function Atrasados() {
  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const { data: atendimentos = [], isLoading } = useAtendimentos();
  const alterarStatus = useAlterarStatus();

  const atrasados = useMemo(() => {
    const now = new Date();
    return atendimentos.filter((a) => {
      if (!a.prazo_resolucao || a.status === "finalizado") return false;
      return new Date(a.prazo_resolucao) < now;
    });
  }, [atendimentos]);

  const filtered = useMemo(() => {
    return atrasados.filter((a) => {
      const matchBusca =
        !busca ||
        a.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
        a.solicitante.toLowerCase().includes(busca.toLowerCase()) ||
        a.assunto.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = statusFilter === "todos" || a.status === statusFilter;
      return matchBusca && matchStatus;
    });
  }, [busca, statusFilter, atrasados]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleInlineStatusChange = async (atendimentoId: string, novoStatus: string) => {
    try {
      await alterarStatus.mutateAsync({ atendimentoId, novoStatus });
      toast({ title: "Status atualizado!" });
    } catch {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    }
  };

  const getDiasAtraso = (prazo: string) => {
    const diff = Math.ceil((new Date().getTime() - new Date(prazo).getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-destructive" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Atrasados</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {filtered.length} atendimento{filtered.length !== 1 ? "s" : ""} com prazo vencido
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col sm:flex-row gap-3 p-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por protocolo, solicitante ou assunto..."
                value={busca}
                onChange={(e) => { setBusca(e.target.value); setPage(1); }}
                className="pl-9 h-9 bg-muted/50 border-transparent"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px] h-9 bg-muted/50 border-transparent">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                {(["aberto", "em_andamento", "respondido"] as StatusType[]).map((s) => (
                  <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Mobile: Cards */}
                <div className="block md:hidden divide-y">
                  {paginated.length === 0 ? (
                    <p className="text-center py-12 text-muted-foreground">Nenhum atendimento atrasado encontrado.</p>
                  ) : (
                    paginated.map((a) => (
                      <div key={a.id} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link to={`/atendimento/${a.id}`} className="font-mono text-xs font-semibold text-primary hover:underline">
                              {a.protocolo}
                            </Link>
                            <p className="text-sm font-medium mt-0.5">{a.solicitante}</p>
                            <p className="text-xs text-muted-foreground truncate">{a.assunto}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <Badge variant="destructive" className="text-[10px]">
                              {getDiasAtraso(a.prazo_resolucao!)} dia{getDiasAtraso(a.prazo_resolucao!) !== 1 ? "s" : ""}
                            </Badge>
                            {isAdmin ? (
                              <Select value={a.status} onValueChange={(v) => handleInlineStatusChange(a.id, v)}>
                                <SelectTrigger className={`h-7 w-auto gap-1 text-[10px] rounded-full px-2.5 py-0.5 font-semibold border-0 focus:ring-0 ${statusColors[a.status]}`}>
                                  {statusIcons[a.status]}
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {(Object.keys(statusLabels) as StatusType[]).map((s) => (
                                    <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge className={`gap-1 text-[10px] ${statusColors[a.status]}`}>
                                {statusIcons[a.status]}
                                {statusLabels[a.status]}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Prazo: {a.prazo_resolucao ? new Date(a.prazo_resolucao).toLocaleDateString("pt-BR") : "—"}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Desktop: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wider">Protocolo</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider">Solicitante</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Assunto</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider">Prazo</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider">Atraso</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginated.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                            Nenhum atendimento atrasado encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginated.map((a) => (
                          <TableRow key={a.id} className="cursor-pointer transition-colors hover:bg-muted/50">
                            <TableCell>
                              <Link to={`/atendimento/${a.id}`} className="font-mono text-xs font-semibold text-primary hover:underline">
                                {a.protocolo}
                              </Link>
                            </TableCell>
                            <TableCell className="text-sm font-medium">{a.solicitante}</TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                              {a.assunto}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {a.prazo_resolucao ? new Date(a.prazo_resolucao).toLocaleDateString("pt-BR") : "—"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="destructive" className="text-[10px]">
                                {getDiasAtraso(a.prazo_resolucao!)} dia{getDiasAtraso(a.prazo_resolucao!) !== 1 ? "s" : ""}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {isAdmin ? (
                                <Select value={a.status} onValueChange={(v) => handleInlineStatusChange(a.id, v)}>
                                  <SelectTrigger className={`h-7 w-auto gap-1 text-[10px] rounded-full px-2.5 py-0.5 font-semibold border-0 focus:ring-0 ${statusColors[a.status]}`}>
                                    {statusIcons[a.status]}
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(Object.keys(statusLabels) as StatusType[]).map((s) => (
                                      <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge className={`gap-1 ${statusColors[a.status]}`}>
                                  {statusIcons[a.status]}
                                  {statusLabels[a.status]}
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Página {page} de {totalPages}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button key={p} variant={p === page ? "default" : "outline"} size="icon" className="h-8 w-8 text-xs" onClick={() => setPage(p)}>
                  {p}
                </Button>
              ))}
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
