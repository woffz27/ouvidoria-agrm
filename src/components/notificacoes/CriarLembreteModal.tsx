import { useState } from "react";
import { Bell, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCriarNotificacao } from "@/hooks/use-notificacoes";

interface CriarLembreteModalProps {
  atendimentoId: string;
  protocolo?: string;
  trigger?: React.ReactNode;
}

export function CriarLembreteModal({ atendimentoId, protocolo, trigger }: CriarLembreteModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [hora, setHora] = useState("09:00");
  const [justificativa, setJustificativa] = useState("");
  const { toast } = useToast();
  const criarNotificacao = useCriarNotificacao();

  const handleSubmit = async () => {
    if (!date) {
      toast({ title: "Selecione uma data", variant: "destructive" });
      return;
    }
    const [h, m] = hora.split(":").map(Number);
    const dataAlerta = new Date(date);
    dataAlerta.setHours(h, m, 0, 0);

    if (dataAlerta <= new Date()) {
      toast({ title: "A data deve ser no futuro", variant: "destructive" });
      return;
    }

    try {
      await criarNotificacao.mutateAsync({
        atendimento_id: atendimentoId,
        data_alerta: dataAlerta.toISOString(),
        justificativa: justificativa.trim() || undefined,
      });
      toast({ title: "Lembrete criado!" });
      setOpen(false);
      setDate(undefined);
      setHora("09:00");
      setJustificativa("");
    } catch {
      toast({ title: "Erro ao criar lembrete", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Criar lembrete"
          >
            <Bell className="h-3.5 w-3.5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Criar Lembrete
            {protocolo && <span className="text-xs font-mono text-muted-foreground">({protocolo})</span>}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Horário
            </Label>
            <Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Justificativa (opcional)</Label>
            <Textarea
              placeholder="Ex: Cobrar retorno do setor técnico"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={criarNotificacao.isPending}>
            {criarNotificacao.isPending ? "Criando..." : "Criar Lembrete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
