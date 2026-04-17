import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, Bell, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { statusLabels } from "@/lib/mock-data";
import { useNotificacoes, type Notificacao } from "@/hooks/use-notificacoes";
import { DetalheNotificacaoModal } from "@/components/notificacoes/DetalheNotificacaoModal";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function formatHora(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getTempoCurto(iso: string): { texto: string; vencido: boolean } {
  const now = new Date();
  const alerta = new Date(iso);
  const diffMs = alerta.getTime() - now.getTime();
  const vencido = diffMs <= 0;
  const abs = Math.abs(diffMs);
  const days = Math.floor(abs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((abs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
  let texto = "";
  if (days > 0) texto = `${days}d`;
  else if (hours > 0) texto = `${hours}h`;
  else texto = `${minutes}min`;
  return { texto, vencido };
}

export default function CalendarioSLA() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selecionada, setSelecionada] = useState<Notificacao | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: notificacoes = [], isLoading } = useNotificacoes();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const byDay = useMemo(() => {
    const map: Record<number, Notificacao[]> = {};
    notificacoes.forEach((n) => {
      const d = new Date(n.data_alerta);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(n);
      }
    });
    // Ordenar por horário dentro do dia
    Object.keys(map).forEach((k) => {
      map[Number(k)].sort(
        (a, b) => new Date(a.data_alerta).getTime() - new Date(b.data_alerta).getTime()
      );
    });
    return map;
  }, [notificacoes, year, month]);

  const days = getCalendarDays(year, month);
  const today = now.getDate();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;

  const abrirDetalhe = (n: Notificacao) => {
    setSelecionada(n);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  const renderCard = (n: Notificacao) => {
    const { texto: tempo, vencido } = getTempoCurto(n.data_alerta);
    return (
      <button
        key={n.id}
        onClick={() => abrirDetalhe(n)}
        className={`block w-full text-left rounded border p-1.5 text-[10px] hover:bg-accent/50 transition-colors space-y-0.5 ${
          vencido
            ? "bg-destructive/5 border-destructive/30"
            : n.lida
            ? "bg-muted/40 border-muted-foreground/20 opacity-70"
            : "bg-card border-primary/20"
        }`}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono font-semibold text-primary truncate flex items-center gap-1">
            <Bell className="h-2.5 w-2.5 shrink-0" />
            {formatHora(n.data_alerta)}
          </span>
          {vencido ? (
            <AlertCircle className="h-3 w-3 text-destructive shrink-0" />
          ) : n.lida ? (
            <CheckCircle2 className="h-3 w-3 text-muted-foreground shrink-0" />
          ) : null}
        </div>
        <p className="font-mono text-primary/80 truncate text-[9px]">{n.protocolo ?? "—"}</p>
        {n.solicitante && (
          <p className="text-muted-foreground truncate">{n.solicitante}</p>
        )}
        <div className="flex items-center justify-between gap-1">
          {n.status && (
            <Badge variant="outline" className="text-[8px] px-1 py-0 h-auto">
              {statusLabels[n.status as keyof typeof statusLabels] ?? n.status}
            </Badge>
          )}
          <span className={`text-[8px] ${vencido ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
            {vencido ? `-${tempo}` : tempo}
          </span>
        </div>
      </button>
    );
  };

  const renderCardMobile = (n: Notificacao) => {
    const { texto: tempo, vencido } = getTempoCurto(n.data_alerta);
    return (
      <button
        key={n.id}
        onClick={() => abrirDetalhe(n)}
        className={`block w-full text-left rounded-lg border p-3 space-y-1.5 hover:bg-accent/50 transition-colors ${
          vencido ? "border-destructive/30 bg-destructive/5" : n.lida ? "opacity-70" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Bell className="h-3 w-3" />
            {formatHora(n.data_alerta)}
          </span>
          <span className={`text-[10px] ${vencido ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
            {vencido ? `Disparado há ${tempo}` : `Em ${tempo}`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-primary">{n.protocolo ?? "—"}</span>
          {n.status && (
            <Badge variant="outline" className="text-[10px]">
              {statusLabels[n.status as keyof typeof statusLabels] ?? n.status}
            </Badge>
          )}
        </div>
        {n.solicitante && (
          <p className="text-xs text-muted-foreground truncate">{n.solicitante}</p>
        )}
        {n.justificativa && (
          <p className="text-xs line-clamp-2 break-words">{n.justificativa}</p>
        )}
      </button>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Calendário de Notificações</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Visualize todos os lembretes agendados e seus atendimentos relacionados
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-sm font-semibold">
              {MONTH_NAMES[month]} {year}
            </CardTitle>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            {/* Desktop: Grid */}
            <div className="hidden md:block">
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                {WEEKDAYS.map((wd) => (
                  <div key={wd} className="bg-muted px-2 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {wd}
                  </div>
                ))}
                {days.map((day, i) => (
                  <div
                    key={i}
                    className={`bg-background min-h-[110px] p-1.5 ${
                      day === null ? "bg-muted/30" : ""
                    } ${isCurrentMonth && day === today ? "ring-2 ring-primary ring-inset" : ""}`}
                  >
                    {day !== null && (
                      <>
                        <span className={`text-xs font-medium ${isCurrentMonth && day === today ? "text-primary font-bold" : "text-muted-foreground"}`}>
                          {day}
                        </span>
                        <div className="mt-1 space-y-1 max-h-[140px] overflow-y-auto">
                          {(byDay[day] || []).map(renderCard)}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: List by day */}
            <div className="block md:hidden space-y-3">
              {Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => i + 1)
                .filter((d) => byDay[d]?.length)
                .map((d) => (
                  <div key={d} className="space-y-2">
                    <p className={`text-xs font-semibold ${isCurrentMonth && d === today ? "text-primary" : "text-muted-foreground"}`}>
                      {d} de {MONTH_NAMES[month]}
                    </p>
                    {byDay[d].map(renderCardMobile)}
                  </div>
                ))}
              {Object.keys(byDay).length === 0 && (
                <p className="text-center py-8 text-muted-foreground text-sm">
                  Nenhum lembrete agendado neste mês.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <DetalheNotificacaoModal
        notificacao={selecionada}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </AppLayout>
  );
}
