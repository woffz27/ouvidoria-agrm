import {
  BarChart3,
  FileText,
  Clock,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  ThumbsUp,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Loader2,
  CalendarClock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  statusLabels,
  categoriaLabels,
  canalLabels,
  tipoProblemaLabels,
} from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { useAtendimentos, useEstatisticas } from "@/hooks/use-atendimentos";

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

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useEstatisticas();
  const { data: atendimentos = [], isLoading: atendimentosLoading } = useAtendimentos();

  const recentes = atendimentos.slice(0, 5);

  const statCards = stats ? [
    { title: "Total de Atendimentos", value: stats.total, icon: <FileText className="h-5 w-5" />, color: "border-l-primary", bg: "bg-primary/5", iconColor: "text-primary" },
    { title: "Abertos", value: stats.abertos, icon: <AlertCircle className="h-5 w-5" />, color: "border-l-accent", bg: "bg-accent/10", iconColor: "text-accent" },
    { title: "Em Andamento", value: stats.emAndamento, icon: <Clock className="h-5 w-5" />, color: "border-l-secondary", bg: "bg-secondary/10", iconColor: "text-secondary" },
    { title: "Atrasados", value: stats.atrasados, icon: <CalendarClock className="h-5 w-5" />, color: "border-l-destructive", bg: "bg-destructive/10", iconColor: "text-destructive", link: "/atrasados" },
    { title: "Finalizados", value: stats.finalizados, icon: <CheckCircle2 className="h-5 w-5" />, color: "border-l-success", bg: "bg-success/10", iconColor: "text-success" },
  ] : [];

  if (statsLoading || atendimentosLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!stats) return null;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Visão geral da Ouvidoria AGRM</p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((stat) => {
            const content = (
              <Card key={stat.title} className={`card-hover border-l-4 ${stat.color} ${(stat as any).link ? "cursor-pointer" : ""}`}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.iconColor}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
            return (stat as any).link ? (
              <Link key={stat.title} to={(stat as any).link}>{content}</Link>
            ) : (
              <div key={stat.title}>{content}</div>
            );
          })}
        </div>

        {/* Secondary stats */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4 text-primary" /> Por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {([
                { key: "reclamacao" as const, icon: <AlertCircle className="h-4 w-4 text-destructive" />, color: "bg-destructive" },
                { key: "sugestao" as const, icon: <Lightbulb className="h-4 w-4 text-accent" />, color: "bg-accent" },
                { key: "elogio" as const, icon: <ThumbsUp className="h-4 w-4 text-success" />, color: "bg-success" },
                { key: "solicitacao" as const, icon: <MessageCircle className="h-4 w-4 text-secondary" />, color: "bg-secondary" },
              ]).map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span className="text-sm">{categoriaLabels[item.key]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${stats.total ? (stats.porCategoria[item.key] / stats.total) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-6 text-right">{stats.porCategoria[item.key]}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-primary" /> Por Canal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["site", "whatsapp", "telefone"] as const).map((canal) => (
                <div key={canal} className="flex items-center justify-between">
                  <span className="text-sm">{canalLabels[canal]}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${stats.total ? (stats.porCanal[canal] / stats.total) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-6 text-right">{stats.porCanal[canal]}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <AlertCircle className="h-4 w-4 text-primary" /> Por Tipo de Problema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["extravasamento_esgoto", "vazamento_agua", "pavimentacao", "outros"] as const).map((tipo) => (
                <div key={tipo} className="flex items-center justify-between">
                  <span className="text-sm">{tipoProblemaLabels[tipo]}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${stats.total ? (stats.porTipoProblema[tipo] / stats.total) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-6 text-right">{stats.porTipoProblema[tipo]}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" /> Atendimentos Recentes
            </CardTitle>
            <Link to="/atendimentos" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Protocolo</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Solicitante</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Assunto</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Canal</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentes.map((a) => (
                  <TableRow key={a.id} className="cursor-pointer transition-colors hover:bg-muted/50">
                    <TableCell>
                      <Link to={`/atendimento/${a.id}`} className="font-mono text-xs font-semibold text-primary hover:underline">
                        {a.protocolo}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{a.solicitante}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                      {a.assunto}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground">{canalLabels[a.canal]}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`gap-1 text-[10px] ${statusColors[a.status]}`}>
                        {statusIcons[a.status]}
                        {statusLabels[a.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
