import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  Clock,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  type Notificacao,
  useExcluirNotificacao,
  useMarcarLida,
} from "@/hooks/use-notificacoes";
import { CriarLembreteModal } from "./CriarLembreteModal";
import { statusLabels } from "@/lib/mock-data";

interface Props {
  notificacao: Notificacao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getTempoRestanteAlerta(dataAlerta: string): {
  texto: string;
  vencido: boolean;
} {
  const now = new Date();
  const alerta = new Date(dataAlerta);
  const diffMs = alerta.getTime() - now.getTime();
  const vencido = diffMs <= 0;
  const abs = Math.abs(diffMs);
  const days = Math.floor(abs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((abs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (days === 0 && minutes > 0) parts.push(`${minutes}min`);
  if (parts.length === 0) parts.push("agora");

  const timeStr = parts.join(" ");
  return {
    texto: vencido ? `Disparado há ${timeStr}` : `Em ${timeStr}`,
    vencido,
  };
}

export function DetalheNotificacaoModal({ notificacao, open, onOpenChange }: Props) {
  const { isAdmin, isOuvidor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const podeGerenciar = isAdmin || isOuvidor;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const excluir = useExcluirNotificacao();
  const marcarLida = useMarcarLida();

  if (!notificacao) return null;

  const dataAlerta = new Date(notificacao.data_alerta);
  const { texto: tempoTexto, vencido } = getTempoRestanteAlerta(notificacao.data_alerta);

  const handleIrAtendimento = () => {
    onOpenChange(false);
    navigate(`/atendimento/${notificacao.atendimento_id}`);
  };

  const handleExcluir = async () => {
    try {
      await excluir.mutateAsync(notificacao.id);
      toast({ title: "Lembrete excluído" });
      setDeleteOpen(false);
      onOpenChange(false);
    } catch {
      toast({ title: "Erro ao excluir lembrete", variant: "destructive" });
    }
  };

  const handleMarcarLida = async () => {
    try {
      await marcarLida.mutateAsync(notificacao.id);
      toast({ title: "Marcado como lido" });
      onOpenChange(false);
    } catch {
      toast({ title: "Erro ao marcar como lido", variant: "destructive" });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-6">
              <Bell className="h-4 w-4 text-primary shrink-0" />
              <span>Detalhes do Lembrete</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* Status badges */}
            <div className="flex flex-wrap items-center gap-2">
              {vencido ? (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" /> Vencido
                </Badge>
              ) : (
                <Badge className="gap-1 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20">
                  <CalendarClock className="h-3 w-3" /> Pendente
                </Badge>
              )}
              {notificacao.lida && (
                <Badge variant="outline" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Lido
                </Badge>
              )}
            </div>

            {/* Data/hora alerta */}
            <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                <Clock className="h-3 w-3" /> Data do alerta
              </div>
              <p className="text-sm font-medium">
                {format(dataAlerta, "PPP 'às' HH:mm", { locale: ptBR })}
              </p>
              <p className={`text-xs font-semibold ${vencido ? "text-destructive" : "text-primary"}`}>
                {tempoTexto}
              </p>
            </div>

            {/* Justificativa */}
            {notificacao.justificativa && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Justificativa
                </p>
                <p className="text-sm whitespace-pre-wrap break-words rounded-lg border bg-background p-3">
                  {notificacao.justificativa}
                </p>
              </div>
            )}

            <Separator />

            {/* Card do atendimento */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Atendimento relacionado
              </p>
              <div className="rounded-lg border p-3 space-y-2 bg-card">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-primary">
                    {notificacao.protocolo ?? "—"}
                  </span>
                  {notificacao.status && (
                    <Badge variant="outline" className="text-[10px]">
                      {statusLabels[notificacao.status as keyof typeof statusLabels] ?? notificacao.status}
                    </Badge>
                  )}
                </div>
                {notificacao.assunto && (
                  <p className="text-sm font-medium line-clamp-2">{notificacao.assunto}</p>
                )}
                {notificacao.solicitante && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="h-3 w-3 shrink-0" />
                    <span className="truncate">{notificacao.solicitante}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-2 pt-1">
              <Button onClick={handleIrAtendimento} className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                Ir para o atendimento
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {podeGerenciar && (
                  <Button
                    variant="outline"
                    onClick={() => setEditOpen(true)}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                )}
                {podeGerenciar && (
                  <Button
                    variant="outline"
                    onClick={() => setDeleteOpen(true)}
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                )}
              </div>

              {!notificacao.lida && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarcarLida}
                  disabled={marcarLida.isPending}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar como lido
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
      {podeGerenciar && (
        <CriarLembreteModal
          atendimentoId={notificacao.atendimento_id}
          protocolo={notificacao.protocolo}
          notificacao={notificacao}
          open={editOpen}
          onOpenChange={(o) => {
            setEditOpen(o);
            if (!o) onOpenChange(false);
          }}
          trigger={null}
        />
      )}

      {/* Confirmação exclusão */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lembrete?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O lembrete será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExcluir}
              disabled={excluir.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {excluir.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
