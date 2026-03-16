import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Atendimento = Tables<"atendimentos">;
export type Atualizacao = Tables<"atualizacoes">;
export type AtendimentoInsert = TablesInsert<"atendimentos">;

export type AtendimentoComAtualizacoes = Atendimento & {
  atualizacoes: Atualizacao[];
};

export function useAtendimentos() {
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
  const queryClient = useQueryClient();
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

      // Create initial atualizacao
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
    },
  });
}

export function useAdicionarComentario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ atendimentoId, conteudo }: { atendimentoId: string; conteudo: string }) => {
      const { data, error } = await supabase
        .from("atualizacoes")
        .insert({
          atendimento_id: atendimentoId,
          usuario: "Atendente",
          conteudo,
          tipo: "comentario",
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

export function useEstatisticas() {
  return useQuery({
    queryKey: ["estatisticas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("atendimentos").select("status, categoria, canal, tipo_problema");
      if (error) throw error;

      const total = data.length;
      const abertos = data.filter((a) => a.status === "aberto").length;
      const emAndamento = data.filter((a) => a.status === "em_andamento").length;
      const respondidos = data.filter((a) => a.status === "respondido").length;
      const finalizados = data.filter((a) => a.status === "finalizado").length;

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

      return { total, abertos, emAndamento, respondidos, finalizados, porCategoria, porCanal, porTipoProblema };
    },
  });
}
