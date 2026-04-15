import { Bell, Check, Trash2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificacoes, useNotificacoesNaoLidas, useMarcarLida, useExcluirNotificacao } from "@/hooks/use-notificacoes";

export function NotificacoesDropdown() {
  const { data: todas = [] } = useNotificacoes();
  const naoLidas = useNotificacoesNaoLidas();
  const marcarLida = useMarcarLida();
  const excluirNotificacao = useExcluirNotificacao();

  const count = naoLidas.length;

  // Show recent 20
  const recentes = todas.slice(0, 20);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b px-3 py-2">
          <p className="text-sm font-semibold">Notificações</p>
          <p className="text-[10px] text-muted-foreground">
            {count > 0 ? `${count} pendente${count > 1 ? "s" : ""}` : "Nenhuma pendente"}
          </p>
        </div>
        <ScrollArea className="max-h-[320px]">
          {recentes.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">Nenhuma notificação</p>
          ) : (
            <div className="divide-y">
              {recentes.map((n) => {
                const isActive = !n.lida && new Date(n.data_alerta) <= new Date();
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-2 px-3 py-2.5 text-xs ${isActive ? "bg-accent/10" : ""}`}
                  >
                    <Clock className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/atendimento/${n.atendimento_id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        Ver atendimento
                      </Link>
                      {n.justificativa && (
                        <p className="text-muted-foreground truncate mt-0.5">{n.justificativa}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {format(new Date(n.data_alerta), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!n.lida && (
                        <button
                          onClick={() => marcarLida.mutate(n.id)}
                          className="rounded p-1 text-muted-foreground hover:text-success hover:bg-success/10 transition-colors"
                          title="Marcar como lida"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => excluirNotificacao.mutate(n.id)}
                        className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
