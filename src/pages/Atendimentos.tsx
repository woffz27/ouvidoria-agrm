import { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Filter,
  AlertCircle,
  Clock,
  MessageCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  mockAtendimentos,
  statusLabels,
  categoriaLabels,
  canalLabels,
  tipoProblemaLabels,
  type StatusType,
  type CategoriaType,
  type TipoProblemaType,
} from "@/lib/mock-data";
import { Link } from "react-router-dom";

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
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return mockAtendimentos.filter((a) => {
      const matchBusca =
        !busca ||
        a.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
        a.solicitante.toLowerCase().includes(busca.toLowerCase()) ||
        a.assunto.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = statusFilter === "todos" || a.status === statusFilter;
      const matchCategoria = categoriaFilter === "todos" || a.categoria === categoriaFilter;
      const matchTipo = tipoProblemaFilter === "todos" || a.tipo_problema === tipoProblemaFilter;
      return matchBusca && matchStatus && matchCategoria && matchTipo;
    });
  }, [busca, statusFilter, categoriaFilter, tipoProblemaFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = () => {
    setPage(1);
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
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Link to="/novo-atendimento">
              <Button size="sm" className="gap-1.5">
                <FileText className="h-4 w-4" />
                Novo
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="flex flex-col sm:flex-row gap-3 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por protocolo, solicitante ou assunto..."
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  handleFilterChange();
                }}
                className="pl-9 h-9 bg-muted/50 border-transparent"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px] h-9 bg-muted/50 border-transparent">
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
            <Select
              value={categoriaFilter}
              onValueChange={(v) => {
                setCategoriaFilter(v);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px] h-9 bg-muted/50 border-transparent">
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
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Protocolo</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Solicitante</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Assunto</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Categoria</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Canal</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Data</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      Nenhum atendimento encontrado.
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
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                        {a.assunto}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="text-[10px]">
                          {categoriaLabels[a.categoria]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {canalLabels[a.canal]}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {new Date(a.data_abertura).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge className={`gap-1 text-[10px] ${statusColors[a.status]}`}>
                          {statusIcons[a.status]}
                          {statusLabels[a.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
