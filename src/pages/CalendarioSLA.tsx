import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { statusLabels } from "@/lib/mock-data";
import { SlaBadge } from "@/components/sla/SlaBadge";
import { getTempoRestante } from "@/lib/sla-utils";
import { useAtendimentos } from "@/hooks/use-atendimentos";
import { Link } from "react-router-dom";

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

export default function CalendarioSLA() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const { data: atendimentos = [], isLoading } = useAtendimentos();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const byDay = useMemo(() => {
    const map: Record<number, typeof atendimentos> = {};
    atendimentos.forEach((a) => {
      if (!a.prazo_resolucao || a.status === "finalizado") return;
      const d = new Date(a.prazo_resolucao);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(a);
      }
    });
    return map;
  }, [atendimentos, year, month]);

  const days = getCalendarDays(year, month);
  const today = now.getDate();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Calendário de Prazos</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Visualize os prazos dos protocolos por mês</p>
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
                    className={`bg-background min-h-[100px] p-1.5 ${
                      day === null ? "bg-muted/30" : ""
                    } ${isCurrentMonth && day === today ? "ring-2 ring-primary ring-inset" : ""}`}
                  >
                    {day !== null && (
                      <>
                        <span className={`text-xs font-medium ${isCurrentMonth && day === today ? "text-primary font-bold" : "text-muted-foreground"}`}>
                          {day}
                        </span>
                        <div className="mt-1 space-y-1 max-h-[120px] overflow-y-auto">
                          {(byDay[day] || []).map((a) => (
                            <Link key={a.id} to={`/atendimento/${a.id}`} className="block">
                              <div className="rounded border bg-card p-1.5 text-[10px] hover:bg-accent/50 transition-colors space-y-0.5">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-mono font-semibold text-primary truncate">{a.protocolo}</span>
                                  <SlaBadge prazo={a.prazo_resolucao} status={a.status} />
                                </div>
                                <p className="text-muted-foreground truncate">{a.assunto}</p>
                                <div className="flex items-center justify-between gap-1">
                                  <Badge variant="outline" className="text-[8px] px-1 py-0 h-auto">
                                    {statusLabels[a.status]}
                                  </Badge>
                                  <span className="text-muted-foreground text-[8px]">
                                    {getTempoRestante(a.prazo_resolucao)}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: List by day */}
            <div className="block md:hidden space-y-2">
              {Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => i + 1)
                .filter((d) => byDay[d]?.length)
                .map((d) => (
                  <div key={d} className="space-y-1">
                    <p className={`text-xs font-semibold ${isCurrentMonth && d === today ? "text-primary" : "text-muted-foreground"}`}>
                      {d} de {MONTH_NAMES[month]}
                    </p>
                    {byDay[d].map((a) => (
                      <Link key={a.id} to={`/atendimento/${a.id}`} className="block">
                        <div className="rounded-lg border p-3 space-y-1 hover:bg-accent/50 transition-colors">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-semibold text-primary">{a.protocolo}</span>
                            <SlaBadge prazo={a.prazo_resolucao} status={a.status} />
                          </div>
                          <p className="text-sm truncate">{a.assunto}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px]">{statusLabels[a.status]}</Badge>
                            <span className="text-[10px] text-muted-foreground">{getTempoRestante(a.prazo_resolucao)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              {Object.keys(byDay).length === 0 && (
                <p className="text-center py-8 text-muted-foreground text-sm">Nenhum protocolo com prazo neste mês.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
