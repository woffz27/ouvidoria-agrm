import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  Send,
  User,
  Mail,
  Phone,
  Globe,
  Tag,
  Calendar,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  mockAtendimentos,
  statusLabels,
  categoriaLabels,
  canalLabels,
  tipoProblemaLabels,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  aberto: "bg-accent text-accent-foreground",
  em_andamento: "bg-secondary text-secondary-foreground",
  respondido: "bg-primary text-primary-foreground",
  finalizado: "bg-success text-success-foreground",
};

const statusIcons: Record<string, React.ReactNode> = {
  aberto: <AlertCircle className="h-4 w-4" />,
  em_andamento: <Clock className="h-4 w-4" />,
  respondido: <MessageCircle className="h-4 w-4" />,
  finalizado: <CheckCircle2 className="h-4 w-4" />,
};

export default function DetalhesAtendimento() {
  const { id } = useParams();
  const { toast } = useToast();
  const [novoComentario, setNovoComentario] = useState("");

  const atendimento = mockAtendimentos.find((a) => a.id === id);

  if (!atendimento) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold">Atendimento não encontrado</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            O atendimento solicitado não existe.
          </p>
          <Link to="/atendimentos">
            <Button variant="outline">Voltar para listagem</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleAddComment = () => {
    if (!novoComentario.trim()) return;
    toast({ title: "Comentário adicionado!", description: "Seu comentário foi registrado." });
    setNovoComentario("");
  };

  const infoItems = [
    { icon: <Hash className="h-4 w-4" />, label: "Número de Protocolo", value: atendimento.protocolo, mono: true },
    { icon: <User className="h-4 w-4" />, label: "Solicitante", value: atendimento.solicitante },
    { icon: <Mail className="h-4 w-4" />, label: "E-mail", value: atendimento.email },
    { icon: <Phone className="h-4 w-4" />, label: "Telefone", value: atendimento.telefone },
    { icon: <Globe className="h-4 w-4" />, label: "Canal", value: canalLabels[atendimento.canal] },
    { icon: <Tag className="h-4 w-4" />, label: "Categoria", value: categoriaLabels[atendimento.categoria] },
    { icon: <Tag className="h-4 w-4" />, label: "Tipo de Problema", value: tipoProblemaLabels[atendimento.tipo_problema] },
    { icon: <Calendar className="h-4 w-4" />, label: "Data de Abertura", value: new Date(atendimento.data_abertura).toLocaleString("pt-BR") },
    { icon: <Clock className="h-4 w-4" />, label: "Última Atualização", value: new Date(atendimento.data_atualizacao).toLocaleString("pt-BR") },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link to="/atendimentos">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight">{atendimento.assunto}</h1>
              <Badge className={`gap-1 ${statusColors[atendimento.status]}`}>
                {statusIcons[atendimento.status]}
                {statusLabels[atendimento.status]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Protocolo{" "}
              <span className="font-mono font-semibold text-primary">
                {atendimento.protocolo}
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Info Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted-foreground">{item.icon}</div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {item.label}
                    </p>
                    <p className={`text-sm font-medium ${item.mono ? "font-mono text-primary" : ""}`}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {atendimento.descricao}
                </p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Histórico ({atendimento.atualizacoes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atendimento.atualizacoes.map((att, i) => (
                    <div key={att.id}>
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            att.tipo === "status_change"
                              ? "bg-accent/20 text-accent"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {att.tipo === "status_change" ? (
                            <Clock className="h-3.5 w-3.5" />
                          ) : (
                            <MessageCircle className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold">{att.usuario}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(att.data).toLocaleString("pt-BR")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {att.conteudo}
                          </p>
                        </div>
                      </div>
                      {i < atendimento.atualizacoes.length - 1 && (
                        <Separator className="my-3 ml-3.5" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Add comment */}
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Adicionar Comentário
                  </p>
                  <Textarea
                    placeholder="Escreva sua resposta ou comentário..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    className="min-h-[80px] mb-3"
                  />
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={handleAddComment}
                    disabled={!novoComentario.trim()}
                  >
                    <Send className="h-3.5 w-3.5" /> Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
