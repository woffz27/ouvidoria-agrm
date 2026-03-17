import { useState, useMemo } from "react";
import {
  FileText, Search, Filter, AlertCircle, Clock, MessageCircle,
  CheckCircle2, ChevronLeft, ChevronRight, Download, Loader2, CalendarClock, Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  statusLabels, categoriaLabels, canalLabels, tipoProblemaLabels,
  type StatusType, type CategoriaType, type TipoProblemaType,
} from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { useAtendimentos, useAlterarStatus, useExcluirAtendimento } from "@/hooks/use-atendimentos";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const statusColors: Record<string, string> = {
  aberto: "bg-accent text-accent-foreground",
  em_andamento: "bg-secondary text-secondary-foreground",
  respondido: "bg-primary text-primary-foreground",
  finalizado: "bg-success text-success-foreground",
};

const statusIcons: Record<string, React.ReactNode> = {
  aberto: <AlertCircle className="h-3.5 w-3.5" />,
  em_andamento: <Clock className="h-3.5 w-3.5" />,
  respondido: <MessageCircle className="h-3.5 w-3.5" />,
  finalizado: <CheckCircle2 className="h-3.5 w-3.5" />,
};

const ITEMS_PER_PAGE = 5;

export default function Atendimentos() {
  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todos");
  const [tipoProblemaFilter, setTipoProblemaFilter] = useState<string>("todos");
  const [atrasadosFilter, setAtrasadosFilter] = useState(false);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const { data: atendimentos = [], isLoading } = useAtendimentos();
  const alterarStatus = useAlterarStatus();
  const excluirAtendimento = useExcluirAtendimento();

  const handleExcluir = async (id: string) => {
    try {
      await excluirAtendimento.mutateAsync(id);
      toast({ title: "Atendimento excluído!" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const filtered = useMemo(() => {
    return atendimentos.filter((a) => {
      const matchBusca =
        !busca ||
        a.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
        a.solicitante.toLowerCase().includes(busca.toLowerCase()) ||
        a.assunto.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = statusFilter === "todos" || a.status === statusFilter;
      const matchCategoria = categoriaFilter === "todos" || a.categoria === categoriaFilter;
      const matchTipo = tipoProblemaFilter === "todos" || a.tipo_problema === tipoProblemaFilter;
      const matchAtrasados = !atrasadosFilter || (a.prazo_resolucao && new Date(a.prazo_resolucao) < new Date() && a.status !== "finalizado");
      return matchBusca && matchStatus && matchCategoria && matchTipo && matchAtrasados;
    });
  }, [busca, statusFilter, categoriaFilter, tipoProblemaFilter, atrasadosFilter, atendimentos]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = () => setPage(1);

  const handleInlineStatusChange = async (atendimentoId: string, novoStatus: string) => {
    try {
      await alterarStatus.mutateAsync({ atendimentoId, novoStatus });
      toast({ title: "Status atualizado!" });
    } catch {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Atendimentos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} atendimento{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" /> Exportar PDF
            </Button>
            <Link to="/novo-atendimento">
              <Button size="sm" className="gap-1.5">
                <FileText className="h-4 w-4" /> Novo
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="flex flex-col sm:flex-row gap-3 p-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por protocolo, solicitante ou assunto..."
                value={busca}
                onChange={(e) => { setBusca(e.target.value); handleFilterChange(); }}
                className="pl-9 h-9 bg-muted/50 border-transparent"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); handleFilterChange(); }}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px] h-9 bg-muted/50 border-transparent">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                {(Object.keys(statusLabels) as StatusType[]).map((s) => (
                  <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoriaFilter} onValueChange={(v) => { setCategoriaFilter(v); handleFilterChange(); }}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px] h-9 bg-muted/50 border-transparent">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas categorias</SelectItem>
                {(Object.keys(categoriaLabels) as CategoriaType[]).map((c) => (
                  <SelectItem key={c} value={c}>{categoriaLabels[c]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tipoProblemaFilter} onValueChange={(v) => { setTipoProblemaFilter(v); handleFilterChange(); }}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[150px] h-9 bg-muted/50 border-transparent">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Tipo de Problema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {(Object.keys(tipoProblemaLabels) as TipoProblemaType[]).map((t) => (
                  <SelectItem key={t} value={t}>{tipoProblemaLabels[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={atrasadosFilter ? "destructive" : "outline"}
              size="sm"
              className="gap-1.5 h-9"
              onClick={() => { setAtrasadosFilter(!atrasadosFilter); handleFilterChange(); }}
            >
              <CalendarClock className="h-3.5 w-3.5" /> Atrasados
            </Button>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Protocolo</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Solicitante</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Assunto</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider hidden xl:table-cell">Categoria</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider hidden xl:table-cell">Tipo</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Canal</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Data</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                    {isAdmin && <TableHead className="text-xs font-semibold uppercase tracking-wider w-10"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 9 : 8} className="text-center py-12 text-muted-foreground">
                        Nenhum atendimento encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((a) => {
                      const isAtrasado = a.prazo_resolucao && new Date(a.prazo_resolucao) < new Date() && a.status !== "finalizado";
                      return (
                        <TableRow key={a.id} className="cursor-pointer transition-colors hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Link to={`/atendimento/${a.id}`} className="font-mono text-xs font-semibold text-primary hover:underline">
                                {a.protocolo}
                              </Link>
                              {isAtrasado && <CalendarClock className="h-3.5 w-3.5 text-destructive" />}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium">{a.solicitante}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                            {a.assunto}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <span className="text-[10px] border rounded-md px-1.5 py-0.5">
                              {categoriaLabels[a.categoria]}
                            </span>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <span className="text-[10px] border rounded-md px-1.5 py-0.5">
                              {tipoProblemaLabels[a.tipo_problema]}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                            {canalLabels[a.canal]}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                            {new Date(a.data_abertura).toLocaleDateString("pt-BR")}
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
                          {isAdmin && (
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir atendimento?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      O atendimento <strong>{a.protocolo}</strong> será excluído permanentemente.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleExcluir(a.id)}>Excluir</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Página {page} de {totalPages}
            </p>
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
