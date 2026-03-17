import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Atendimento = Tables<"atendimentos">;
export type Atualizacao = Tables<"atualizacoes">;
export type AtendimentoInsert = TablesInsert<"atendimentos">;

export type AtendimentoComAtualizacoes = Atendimento & {
  atualizacoes: Atualizacao[];
};

export function useAtendimentos() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("atendimentos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "atendimentos" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["atendimentos"] });
          queryClient.invalidateQueries({ queryKey: ["estatisticas"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["atendimentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendimentos")
        .select("*")
        .order("data_abertura", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAtendimento(id: string | undefined) {
  return useQuery({
    queryKey: ["atendimento", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const { data, error } = await supabase
        .from("atendimentos")
        .select("*, atualizacoes(*)")
        .eq("id", id)
        .order("data", { referencedTable: "atualizacoes", ascending: true })
        .single();
      if (error) throw error;
      return data as AtendimentoComAtualizacoes;
    },
    enabled: !!id,
  });
}

export function useBuscarProtocolo() {
  return {
    buscar: async (protocolo: string) => {
      const { data, error } = await supabase
        .from("atendimentos")
        .select("*")
        .eq("protocolo", protocolo.trim())
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  };
}

export function useCriarAtendimento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (atendimento: AtendimentoInsert) => {
      const { data, error } = await supabase
        .from("atendimentos")
        .insert(atendimento)
        .select()
        .single();
      if (error) throw error;

      const canalLabel = atendimento.canal === "site" ? "Site" : atendimento.canal === "whatsapp" ? "WhatsApp" : "Telefone";
      await supabase.from("atualizacoes").insert({
        atendimento_id: data.id,
        usuario: "Sistema",
        conteudo: `Atendimento criado via ${canalLabel}`,
        tipo: "status_change",
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atendimentos"] });
      queryClient.invalidateQueries({ queryKey: ["estatisticas"] });
    },
  });
}

export function useAdicionarComentario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ atendimentoId, conteudo, arquivos }: { atendimentoId: string; conteudo: string; arquivos?: string[] }) => {
      const { data, error } = await supabase
        .from("atualizacoes")
        .insert({
          atendimento_id: atendimentoId,
          usuario: "Atendente",
          conteudo,
          tipo: "comentario",
          arquivos: arquivos || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["atendimento", vars.atendimentoId] });
      queryClient.invalidateQueries({ queryKey: ["atendimentos"] });
    },
  });
}

export function useEditarComentario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, conteudo, atendimentoId }: { id: string; conteudo: string; atendimentoId: string }) => {
      const { error } = await supabase
        .from("atualizacoes")
        .update({ conteudo })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["atendimento", vars.atendimentoId] });
    },
  });
}

export function useExcluirComentario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, atendimentoId }: { id: string; atendimentoId: string }) => {
      const { error } = await supabase
        .from("atualizacoes")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["atendimento", vars.atendimentoId] });
    },
  });
}

export function useExcluirAtendimento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Delete related atualizacoes first
      await supabase.from("atualizacoes").delete().eq("atendimento_id", id);
      const { error } = await supabase.from("atendimentos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atendimentos"] });
      queryClient.invalidateQueries({ queryKey: ["estatisticas"] });
    },
  });
}

export function useAlterarStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ atendimentoId, novoStatus }: { atendimentoId: string; novoStatus: string }) => {
      const { error: updateError } = await supabase
        .from("atendimentos")
        .update({ status: novoStatus as any })
        .eq("id", atendimentoId);
      if (updateError) throw updateError;

      const statusLabels: Record<string, string> = {
        aberto: "Aberto",
        em_andamento: "Em Andamento",
        respondido: "Respondido",
        finalizado: "Finalizado",
      };

      await supabase.from("atualizacoes").insert({
        atendimento_id: atendimentoId,
        usuario: "Sistema",
        conteudo: `Status alterado para ${statusLabels[novoStatus] || novoStatus}`,
        tipo: "status_change",
      });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["atendimento", vars.atendimentoId] });
      queryClient.invalidateQueries({ queryKey: ["atendimentos"] });
      queryClient.invalidateQueries({ queryKey: ["estatisticas"] });
    },
  });
}

export function useEditarAtendimento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: Record<string, any> }) => {
      const { error } = await supabase
        .from("atendimentos")
        .update(dados)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["atendimento", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["atendimentos"] });
    },
  });
}

export async function uploadArquivos(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage.from("anexos").upload(filePath, file);
    if (error) throw error;

    const { data: urlData } = supabase.storage.from("anexos").getPublicUrl(filePath);
    urls.push(urlData.publicUrl);
  }
  return urls;
}

export function useEstatisticas() {
  return useQuery({
    queryKey: ["estatisticas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("atendimentos").select("status, categoria, canal, tipo_problema, prazo_resolucao");
      if (error) throw error;

      const total = data.length;
      const abertos = data.filter((a) => a.status === "aberto").length;
      const emAndamento = data.filter((a) => a.status === "em_andamento").length;
      const respondidos = data.filter((a) => a.status === "respondido").length;
      const finalizados = data.filter((a) => a.status === "finalizado").length;
      const atrasados = data.filter(
        (a) => a.prazo_resolucao && new Date(a.prazo_resolucao) < new Date() && a.status !== "finalizado"
      ).length;

      const porCategoria = {
        reclamacao: data.filter((a) => a.categoria === "reclamacao").length,
        sugestao: data.filter((a) => a.categoria === "sugestao").length,
        elogio: data.filter((a) => a.categoria === "elogio").length,
        solicitacao: data.filter((a) => a.categoria === "solicitacao").length,
      };

      const porCanal = {
        site: data.filter((a) => a.canal === "site").length,
        whatsapp: data.filter((a) => a.canal === "whatsapp").length,
        telefone: data.filter((a) => a.canal === "telefone").length,
      };

      const porTipoProblema = {
        extravasamento_esgoto: data.filter((a) => a.tipo_problema === "extravasamento_esgoto").length,
        vazamento_agua: data.filter((a) => a.tipo_problema === "vazamento_agua").length,
        pavimentacao: data.filter((a) => a.tipo_problema === "pavimentacao").length,
        outros: data.filter((a) => a.tipo_problema === "outros").length,
      };

      return { total, abertos, emAndamento, respondidos, finalizados, atrasados, porCategoria, porCanal, porTipoProblema };
    },
  });
}
