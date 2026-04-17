import { useState } from "react";
import { Bell, Check, Trash2, Clock, Pencil, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useNotificacoes,
  getNotificacoesNaoLidas,
  useMarcarLida,
  useExcluirNotificacao,
  type Notificacao,
} from "@/hooks/use-notificacoes";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CriarLembreteModal } from "./CriarLembreteModal";

export function NotificacoesDropdown() {
  const { data: todas = [] } = useNotificacoes();
  const naoLidas = getNotificacoesNaoLidas(todas);
  const marcarLida = useMarcarLida();
  const excluirNotificacao = useExcluirNotificacao();
  const { isAdmin, isOuvidor } = useAuth();
  const { toast } = useToast();
  const canManage = isAdmin || isOuvidor;

  const [editando, setEditando] = useState<Notificacao | null>(null);
  const [excluindo, setExcluindo] = useState<Notificacao | null>(null);

  const count = naoLidas.length;
  const recentes = todas.slice(0, 20);

  const handleConfirmDelete = async () => {
    if (!excluindo) return;
    try {
      await excluirNotificacao.mutateAsync(excluindo.id);
      toast({ title: "Lembrete excluído" });
    } catch {
      toast({ title: "Erro ao excluir lembrete", variant: "destructive" });
    } finally {
      setExcluindo(null);
    }
  };

  return (
    <>
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
        <PopoverContent
          className="w-[calc(100vw-1rem)] sm:w-96 p-0"
          align="end"
          sideOffset={8}
        >
          <div className="border-b px-4 py-3 bg-muted/30">
            <p className="text-sm font-semibold">Notificações</p>
            <p className="text-[11px] text-muted-foreground">
              {count > 0 ? `${count} pendente${count > 1 ? "s" : ""}` : "Nenhuma pendente"}
            </p>
          </div>
          <ScrollArea className="max-h-[60vh] sm:max-h-[420px]">
            {recentes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4">
                <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y">
                {recentes.map((n) => {
                  const isActive = !n.lida && new Date(n.data_alerta) <= new Date();
                  return (
                    <div
                      key={n.id}
                      className={`px-3 py-3 text-xs transition-colors hover:bg-muted/40 ${
                        isActive ? "bg-accent/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 shrink-0 rounded-full p-1.5 ${
                          isActive ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                        }`}>
                          <Clock className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <Link
                            to={`/atendimento/${n.atendimento_id}`}
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                          >
                            <FileText className="h-3 w-3" />
                            {n.protocolo ?? "Ver atendimento"}
                          </Link>
                          {n.justificativa && (
                            <p className="text-foreground/80 whitespace-pre-wrap break-words leading-relaxed">
                              {n.justificativa}
                            </p>
                          )}
                          <p className="text-[10px] text-muted-foreground">
                            {format(new Date(n.data_alerta), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-border/40">
                        {!n.lida && (
                          <button
                            onClick={() => marcarLida.mutate(n.id)}
                            className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:text-success hover:bg-success/10 transition-colors"
                            title="Marcar como lida"
                          >
                            <Check className="h-3 w-3" /> Lida
                          </button>
                        )}
                        {canManage && (
                          <>
                            <button
                              onClick={() => setEditando(n)}
                              className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                              title="Editar lembrete"
                            >
                              <Pencil className="h-3 w-3" /> Editar
                            </button>
                            <button
                              onClick={() => setExcluindo(n)}
                              className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              title="Excluir lembrete"
                            >
                              <Trash2 className="h-3 w-3" /> Excluir
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {editando && (
        <CriarLembreteModal
          atendimentoId={editando.atendimento_id}
          protocolo={editando.protocolo}
          notificacao={editando}
          open={!!editando}
          onOpenChange={(o) => !o && setEditando(null)}
          trigger={null}
        />
      )}

      <AlertDialog open={!!excluindo} onOpenChange={(o) => !o && setExcluindo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lembrete?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O lembrete será removido da central de
              notificações, mas o registro permanecerá no histórico do atendimento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
