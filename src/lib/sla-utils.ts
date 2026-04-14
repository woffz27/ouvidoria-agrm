export type SlaStatus = "no_prazo" | "atencao" | "vencido";

export function getSlaStatus(prazo: string | null | undefined, status: string): SlaStatus | null {
  if (!prazo || status === "finalizado") return null;
  const now = new Date();
  const deadline = new Date(prazo);
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) return "vencido";
  if (diffHours < 48) return "atencao";
  return "no_prazo";
}

export function getSlaLabel(sla: SlaStatus | null): string {
  if (!sla) return "";
  const labels: Record<SlaStatus, string> = {
    no_prazo: "No prazo",
    atencao: "Próximo do vencimento",
    vencido: "Vencido",
  };
  return labels[sla];
}

export function getSlaColor(sla: SlaStatus | null): { bg: string; text: string; border: string } {
  if (!sla) return { bg: "", text: "", border: "" };
  const colors: Record<SlaStatus, { bg: string; text: string; border: string }> = {
    no_prazo: { bg: "bg-success/10", text: "text-success", border: "border-success/30" },
    atencao: { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/30" },
    vencido: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30" },
  };
  return colors[sla];
}

export function getTempoRestante(prazo: string | null | undefined): string {
  if (!prazo) return "";
  const now = new Date();
  const deadline = new Date(prazo);
  const diffMs = deadline.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);

  const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));

  let parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (days === 0 && minutes > 0) parts.push(`${minutes}min`);
  if (parts.length === 0) parts.push("0min");

  const timeStr = parts.join(" ");
  return diffMs < 0 ? `Vencido há ${timeStr}` : `${timeStr} restantes`;
}

export function getSlaSort<T extends { prazo_resolucao: string | null; status: string }>(a: T, b: T): number {
  const slaA = getSlaStatus(a.prazo_resolucao, a.status);
  const slaB = getSlaStatus(b.prazo_resolucao, b.status);

  const priority: Record<string, number> = { vencido: 0, atencao: 1, no_prazo: 2 };
  const pA = slaA ? priority[slaA] : 3;
  const pB = slaB ? priority[slaB] : 3;

  if (pA !== pB) return pA - pB;

  // Within same priority, sort by deadline (earliest first)
  const deadlineA = a.prazo_resolucao ? new Date(a.prazo_resolucao).getTime() : Infinity;
  const deadlineB = b.prazo_resolucao ? new Date(b.prazo_resolucao).getTime() : Infinity;
  return deadlineA - deadlineB;
}
