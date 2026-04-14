import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { getTempoRestante, getSlaStatus, getSlaColor } from "@/lib/sla-utils";

interface SlaCountdownProps {
  prazo: string | null | undefined;
  status: string;
}

export function SlaCountdown({ prazo, status }: SlaCountdownProps) {
  const [tempo, setTempo] = useState(() => getTempoRestante(prazo));

  useEffect(() => {
    if (!prazo || status === "finalizado") return;
    setTempo(getTempoRestante(prazo));
    const interval = setInterval(() => {
      setTempo(getTempoRestante(prazo));
    }, 60_000);
    return () => clearInterval(interval);
  }, [prazo, status]);

  const sla = getSlaStatus(prazo, status);
  if (!sla || !prazo) return null;

  const colors = getSlaColor(sla);

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${colors.text}`}>
      <Clock className="h-3.5 w-3.5" />
      <span>{tempo}</span>
    </div>
  );
}
