import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import {
  ArrowLeft, Clock, CheckCircle2, MessageCircle, AlertCircle,
  Send, User, Mail, Phone, Globe, Tag, Calendar, Hash,
  Loader2, Pencil, Trash2, X, Check, Upload, CalendarClock,
  FileText, MessageSquare,
} from "lucide-react";
import DOMPurify from "dompurify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AppLayout } from "@/components/layout/AppLayout";
import { statusLabels, categoriaLabels, canalLabels, tipoProblemaLabels, type StatusType } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useAtendimento, useAdicionarComentario, useEditarComentario, useExcluirComentario, useAlterarStatus, useExcluirAtendimento, useEditarAtendimento, uploadArquivos } from "@/hooks/use-atendimentos";
import { AnexosList } from "@/components/atendimento/AnexosList";
import { useAuth } from "@/contexts/AuthContext";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [novoComentario, setNovoComentario] = useState("");
  const [comentarioArquivos, setComentarioArquivos] = useState<File[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editandoConteudo, setEditandoConteudo] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editandoCampo, setEditandoCampo] = useState<string | null>(null);
  const [editandoValor, setEditandoValor] = useState("");
  const [emailDestinatario, setEmailDestinatario] = useState("");
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const comentarioFileRef = useRef<HTMLInputElement>(null);

  const { data: atendimento, isLoading } = useAtendimento(id);
  const adicionarComentario = useAdicionarComentario();
  const editarComentario = useEditarComentario();
  const excluirComentario = useExcluirComentario();
  const alterarStatus = useAlterarStatus();
  const excluirAtendimento = useExcluirAtendimento();
  const editarAtendimento = useEditarAtendimento();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!atendimento) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold">Atendimento não encontrado</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">O atendimento solicitado não existe.</p>
          <Link to="/atendimentos">
            <Button variant="outline">Voltar para listagem</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleAddComment = async () => {
    if (!novoComentario.trim()) return;
    try {
      setUploading(true);
      let arquivoUrls: string[] = [];
      if (comentarioArquivos.length > 0) {
        arquivoUrls = await uploadArquivos(comentarioArquivos);
      }
      await adicionarComentario.mutateAsync({
        atendimentoId: atendimento.id,
        conteudo: novoComentario,
        arquivos: arquivoUrls.length > 0 ? arquivoUrls : undefined,
      });
      toast({ title: "Comentário adicionado!", description: "Seu comentário foi registrado." });
      setNovoComentario("");
      setComentarioArquivos([]);
    } catch {
      toast({ title: "Erro ao adicionar comentário", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleEditSave = async (attId: string) => {
    try {
      await editarComentario.mutateAsync({ id: attId, conteudo: editandoConteudo, atendimentoId: atendimento.id });
      toast({ title: "Comentário editado!" });
      setEditandoId(null);
    } catch {
      toast({ title: "Erro ao editar", variant: "destructive" });
    }
  };

  const handleDelete = async (attId: string) => {
    try {
      await excluirComentario.mutateAsync({ id: attId, atendimentoId: atendimento.id });
      toast({ title: "Comentário excluído!" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleStatusChange = async (novoStatus: string) => {
    try {
      await alterarStatus.mutateAsync({ atendimentoId: atendimento.id, novoStatus });
      toast({ title: "Status atualizado!" });
    } catch {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    }
  };

  const handleExcluirAtendimento = async () => {
    try {
      await excluirAtendimento.mutateAsync(atendimento.id);
      toast({ title: "Atendimento excluído!" });
      navigate("/atendimentos");
    } catch {
      toast({ title: "Erro ao excluir atendimento", variant: "destructive" });
    }
  };

  const handleSalvarCampo = async (campo: string) => {
    try {
      await editarAtendimento.mutateAsync({ id: atendimento.id, dados: { [campo]: editandoValor || null } });
      toast({ title: "Campo atualizado!" });
      setEditandoCampo(null);
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleWhatsApp = (mensagem: string) => {
    if (!atendimento.telefone) {
      toast({ title: "Sem telefone cadastrado", variant: "destructive" });
      return;
    }
    const tel = atendimento.telefone.replace(/\D/g, "");
    const telFormatted = tel.startsWith("55") ? tel : `55${tel}`;
    const url = `https://wa.me/${telFormatted}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const handleEnviarEmail = async () => {
    if (!emailDestinatario || !novoComentario.trim()) {
      toast({ title: "Preencha o destinatário e o comentário", variant: "destructive" });
      return;
    }
    try {
      setEnviandoEmail(true);
      const { error } = await supabase.functions.invoke("send-email", {
        body: {
          to: emailDestinatario,
          subject: `Re: ${atendimento.assunto} - Protocolo ${atendimento.protocolo}`,
          html_body: novoComentario,
        },
      });
      if (error) throw error;
      toast({ title: "Email enviado com sucesso!" });
    } catch {
      toast({ title: "Erro ao enviar email", variant: "destructive" });
    } finally {
      setEnviandoEmail(false);
    }
  };

  const isAtrasado = atendimento.prazo_resolucao && new Date(atendimento.prazo_resolucao) < new Date() && atendimento.status !== "finalizado";

  const att = atendimento as any;

  const editableField = (campo: string, label: string, value: string | null) => (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground"><FileText className="h-4 w-4" /></div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
        {editandoCampo === campo ? (
          <div className="flex items-center gap-1 mt-0.5">
            <Input
              value={editandoValor}
              onChange={(e) => setEditandoValor(e.target.value)}
              className="h-7 text-sm"
            />
            <button onClick={() => handleSalvarCampo(campo)} className="rounded p-1 text-primary hover:bg-primary/10"><Check className="h-3.5 w-3.5" /></button>
            <button onClick={() => setEditandoCampo(null)} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-3.5 w-3.5" /></button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium">{value || "—"}</p>
            {isAdmin && (
              <button onClick={() => { setEditandoCampo(campo); setEditandoValor(value || ""); }} className="rounded p-0.5 text-muted-foreground hover:text-foreground">
                <Pencil className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const infoItems = [
    { icon: <Hash className="h-4 w-4" />, label: "Protocolo", value: atendimento.protocolo, mono: true },
    { icon: <User className="h-4 w-4" />, label: "Solicitante", value: atendimento.solicitante },
    { icon: <Mail className="h-4 w-4" />, label: "E-mail", value: atendimento.email || "—" },
    { icon: <Phone className="h-4 w-4" />, label: "Telefone", value: atendimento.telefone || "—" },
    { icon: <Globe className="h-4 w-4" />, label: "Canal", value: canalLabels[atendimento.canal] },
    { icon: <Tag className="h-4 w-4" />, label: "Categoria", value: categoriaLabels[atendimento.categoria] },
    { icon: <Tag className="h-4 w-4" />, label: "Tipo de Problema", value: tipoProblemaLabels[atendimento.tipo_problema] },
    { icon: <Calendar className="h-4 w-4" />, label: "Data de Abertura", value: new Date(atendimento.data_abertura).toLocaleString("pt-BR") },
    { icon: <Clock className="h-4 w-4" />, label: "Última Atualização", value: new Date(atendimento.data_atualizacao).toLocaleString("pt-BR") },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link to="/atendimentos">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight break-words min-w-0">{atendimento.assunto}</h1>
              <Badge className={`gap-1 shrink-0 ${statusColors[atendimento.status]}`}>
                {statusIcons[atendimento.status]}
                {statusLabels[atendimento.status]}
              </Badge>
              {isAtrasado && (
                <Badge variant="destructive" className="gap-1 shrink-0">
                  <CalendarClock className="h-3.5 w-3.5" /> Atrasado
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Protocolo <span className="font-mono font-semibold text-primary">{atendimento.protocolo}</span>
            </p>
          </div>
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-1.5 shrink-0">
                  <Trash2 className="h-4 w-4" /> Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir atendimento?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação é irreversível. O atendimento <strong>{atendimento.protocolo}</strong> e todo o seu histórico serão excluídos permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExcluirAtendimento} disabled={excluirAtendimento.isPending}>
                    {excluirAtendimento.isPending ? "Excluindo..." : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          <Card className="xl:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted-foreground">{item.icon}</div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{item.label}</p>
                    <p className={`text-sm font-medium ${item.mono ? "font-mono text-primary" : ""}`}>{item.value}</p>
                  </div>
                </div>
              ))}

              {/* Editable fields - Solicitante */}
              {editableField("ordem_servico_caern", "Ordem de Serviço (CAERN)", att.ordem_servico_caern)}
              {editableField("matricula_imovel", "Matrícula (Imóvel CAERN)", att.matricula_imovel)}

              {/* Endereço */}
              {editableField("logradouro", "Logradouro", att.logradouro)}
              {editableField("bairro", "Bairro", att.bairro)}
              {editableField("cep", "CEP", att.cep)}

              {/* Status management - admin only */}
              {isAdmin && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted-foreground"><CheckCircle2 className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Alterar Status</p>
                    <Select value={atendimento.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(statusLabels) as StatusType[]).map((s) => (
                          <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Prazo */}
              {atendimento.prazo_resolucao && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted-foreground"><CalendarClock className="h-4 w-4" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Prazo</p>
                    <p className={`text-sm font-medium ${isAtrasado ? "text-destructive font-semibold" : ""}`}>
                      {new Date(atendimento.prazo_resolucao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{atendimento.descricao}</p>
                <AnexosList arquivos={atendimento.arquivos} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Histórico ({atendimento.atualizacoes?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atendimento.atualizacoes?.map((att, i) => (
                    <div key={att.id}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          att.tipo === "status_change" ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"
                        }`}>
                          {att.tipo === "status_change" ? <Clock className="h-3.5 w-3.5" /> : <MessageCircle className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold">{att.usuario}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(att.data).toLocaleString("pt-BR")}</span>
                            {att.tipo === "comentario" && isAdmin && (
                              <div className="flex gap-1 ml-auto">
                                <button
                                  onClick={() => { setEditandoId(att.id); setEditandoConteudo(att.conteudo); }}
                                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir comentário?</AlertDialogTitle>
                                      <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(att.id)}>Excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                          </div>
                          {editandoId === att.id ? (
                            <div className="mt-1 space-y-2">
                              <RichTextEditor
                                content={editandoConteudo}
                                onChange={setEditandoConteudo}
                                minHeight="60px"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => handleEditSave(att.id)} disabled={editarComentario.isPending}>
                                  <Check className="h-3 w-3" /> Salvar
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => setEditandoId(null)}>
                                  <X className="h-3 w-3" /> Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-sm text-muted-foreground mt-0.5 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(att.conteudo) }} />
                              <AnexosList arquivos={att.arquivos} />
                            </>
                          )}
                        </div>
                      </div>
                      {i < (atendimento.atualizacoes?.length || 0) - 1 && <Separator className="my-3 ml-3.5" />}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Adicionar Comentário</p>
                  <Textarea
                    placeholder="Escreva sua resposta ou comentário..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    className="min-h-[80px] mb-3"
                  />
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={handleAddComment}
                      disabled={!novoComentario.trim() || adicionarComentario.isPending || uploading}
                    >
                      <Send className="h-3.5 w-3.5" /> {uploading ? "Enviando..." : adicionarComentario.isPending ? "Enviando..." : "Enviar"}
                    </Button>
                    {atendimento.email && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => handleEnviarEmail(novoComentario)}
                        disabled={!novoComentario.trim()}
                      >
                        <Mail className="h-3.5 w-3.5" /> Enviar por E-mail
                      </Button>
                    )}
                    {atendimento.telefone && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => handleWhatsApp(novoComentario)}
                        disabled={!novoComentario.trim()}
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Enviar por WhatsApp
                      </Button>
                    )}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      Anexar arquivo
                      <input
                        ref={comentarioFileRef}
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={(e) => {
                          if (e.target.files) setComentarioArquivos(prev => [...prev, ...Array.from(e.target.files!)]);
                        }}
                        className="hidden"
                      />
                    </label>
                    {comentarioArquivos.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {comentarioArquivos.length} arquivo{comentarioArquivos.length > 1 ? "s" : ""} selecionado{comentarioArquivos.length > 1 ? "s" : ""}
                        <button onClick={() => setComentarioArquivos([])} className="ml-1 text-destructive hover:underline">limpar</button>
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
