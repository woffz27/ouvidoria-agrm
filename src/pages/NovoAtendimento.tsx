import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  MessageSquare,
  Phone,
  Upload,
  X,
  FileText,
  ImageIcon,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/layout/AppLayout";
import { categoriaLabels, tipoProblemaLabels, type CategoriaType, type CanalType, type TipoProblemaType } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useCriarAtendimento } from "@/hooks/use-atendimentos";

const canalIcons: Record<CanalType, React.ReactNode> = {
  site: <Globe className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  telefone: <Phone className="h-4 w-4" />,
};

function gerarProtocolo(): string {
  const ano = new Date().getFullYear();
  const num = Math.floor(Math.random() * 999999) + 1;
  return `${ano}-${String(num).padStart(6, "0")}`;
}

export default function NovoAtendimento() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [canal, setCanal] = useState<CanalType | "">("");
  const [categoria, setCategoria] = useState<CategoriaType | "">("");
  const [tipoProblema, setTipoProblema] = useState<TipoProblemaType | "">("");
  const criarAtendimento = useCriarAtendimento();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArquivos((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-4 w-4 text-success" />;
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4 text-secondary" />;
    return <FileText className="h-4 w-4 text-primary" />;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const protocolo = gerarProtocolo();

    try {
      await criarAtendimento.mutateAsync({
        protocolo,
        solicitante: formData.get("solicitante") as string,
        email: (formData.get("email") as string) || null,
        telefone: (formData.get("telefone") as string) || null,
        assunto: formData.get("assunto") as string,
        descricao: formData.get("descricao") as string,
        categoria: categoria as CategoriaType,
        canal: canal as CanalType,
        tipo_problema: tipoProblema as TipoProblemaType,
      });

      toast({
        title: "Atendimento criado!",
        description: `Protocolo: ${protocolo}`,
      });
      navigate("/atendimentos");
    } catch (error) {
      toast({
        title: "Erro ao criar atendimento",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Atendimento</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registre um novo atendimento na ouvidoria
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações do Solicitante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="solicitante">Nome completo *</Label>
                  <Input id="solicitante" name="solicitante" required placeholder="Nome do solicitante" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" placeholder="email@exemplo.com" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" name="telefone" placeholder="(84) 99999-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="canal">Canal de Atendimento *</Label>
                  <Select required value={canal} onValueChange={(v) => setCanal(v as CanalType)}>
                    <SelectTrigger id="canal">
                      <SelectValue placeholder="Selecione o canal" />
                    </SelectTrigger>
                    <SelectContent>
                      {(["site", "whatsapp", "telefone"] as CanalType[]).map((c) => (
                        <SelectItem key={c} value={c}>
                          <span className="flex items-center gap-2">
                            {canalIcons[c]}
                            {c === "site" ? "Site" : c === "whatsapp" ? "WhatsApp" : "Telefone"}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Detalhes do Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select required value={categoria} onValueChange={(v) => setCategoria(v as CategoriaType)}>
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(categoriaLabels) as CategoriaType[]).map((c) => (
                        <SelectItem key={c} value={c}>{categoriaLabels[c]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo_problema">Tipo de Problema *</Label>
                  <Select required value={tipoProblema} onValueChange={(v) => setTipoProblema(v as TipoProblemaType)}>
                    <SelectTrigger id="tipo_problema">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(tipoProblemaLabels) as TipoProblemaType[]).map((t) => (
                        <SelectItem key={t} value={t}>{tipoProblemaLabels[t]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto *</Label>
                <Input id="assunto" name="assunto" required placeholder="Resumo do atendimento" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  required
                  placeholder="Descreva detalhadamente a situação..."
                  className="min-h-[120px]"
                />
              </div>

              {/* File upload */}
              <div className="space-y-3">
                <Label>Anexos (fotos, vídeos, documentos)</Label>
                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/30">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Arraste arquivos ou clique para selecionar
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Imagens, vídeos e documentos (máx. 10MB cada)
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    style={{ position: "relative", marginTop: "8px" }}
                  />
                </div>

                {arquivos.length > 0 && (
                  <div className="space-y-2">
                    {arquivos.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {getFileIcon(file)}
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="ml-2 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={criarAtendimento.isPending}>
              {criarAtendimento.isPending ? "Registrando..." : "Registrar Atendimento"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
