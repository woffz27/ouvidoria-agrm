import { AlertTriangle, XCircle, Clock } from "lucide-react";
import { getSlaStatus, getSlaColor, getTempoRestante, type SlaStatus } from "@/lib/sla-utils";

interface SlaBadgeProps {
  prazo: string | null | undefined;
  status: string;
  className?: string;
}

export function SlaBadge({ prazo, status, className = "" }: SlaBadgeProps) {
  const sla = getSlaStatus(prazo, status);
  if (!sla) return null;

  const colors = getSlaColor(sla);
  const tempo = getTempoRestante(prazo);

  const icon: Record<SlaStatus, React.ReactNode> = {
    no_prazo: <Clock className="h-3 w-3" />,
    atencao: <AlertTriangle className="h-3 w-3" />,
    vencido: <XCircle className="h-3 w-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      {icon[sla]}
      {tempo}
    </span>
  );
}
