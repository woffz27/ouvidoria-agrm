import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Notificacao {
  id: string;
  user_id: string;
  atendimento_id: string;
  data_alerta: string;
  justificativa: string | null;
  lida: boolean;
  created_at: string;
  protocolo?: string;
  solicitante?: string;
  status?: string;
  assunto?: string;
  prazo_resolucao?: string | null;
}

export function useNotificacoes() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const channelName = `notificacoes-${user.id}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notificacoes" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user?.id]);

  return useQuery({
    queryKey: ["notificacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .order("data_alerta", { ascending: false });
      if (error) throw error;

      const notificacoes = (data ?? []) as Notificacao[];
      const ids = Array.from(new Set(notificacoes.map((n) => n.atendimento_id)));
      if (ids.length === 0) return notificacoes;

      const { data: atendimentos } = await supabase
        .from("atendimentos")
        .select("id, protocolo, solicitante, status, assunto, prazo_resolucao")
        .in("id", ids);

      const map = new Map((atendimentos ?? []).map((a: any) => [a.id, a]));
      return notificacoes.map((n) => {
        const a = map.get(n.atendimento_id) as any;
        return {
          ...n,
          protocolo: a?.protocolo,
          solicitante: a?.solicitante,
          status: a?.status,
          assunto: a?.assunto,
          prazo_resolucao: a?.prazo_resolucao,
        };
      });
    },
    enabled: !!user,
  });
}

export function getNotificacoesNaoLidas(todas: Notificacao[]) {
  const now = new Date();
  return todas.filter((n) => !n.lida && new Date(n.data_alerta) <= now);
}

export function useCriarNotificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificacao: {
      atendimento_id: string;
      data_alerta: string;
      justificativa?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const { data, error } = await supabase
        .from("notificacoes")
        .insert({ ...notificacao, user_id: user.id })
        .select()
        .single();
      if (error) throw error;

      const dataFormatada = new Date(notificacao.data_alerta).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
      const conteudo = notificacao.justificativa
        ? `Lembrete agendado para ${dataFormatada}: ${notificacao.justificativa}`
        : `Lembrete agendado para ${dataFormatada}`;
      await supabase.from("atualizacoes").insert({
        atendimento_id: notificacao.atendimento_id,
        usuario: "Sistema",
        conteudo,
        tipo: "comentario",
      });

      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
      queryClient.invalidateQueries({ queryKey: ["atendimento", vars.atendimento_id] });
    },
  });
}

export function useEditarNotificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      atendimento_id: string;
      data_alerta: string;
      justificativa?: string;
    }) => {
      const { error } = await supabase
        .from("notificacoes")
        .update({
          data_alerta: params.data_alerta,
          justificativa: params.justificativa ?? null,
          lida: false,
        })
        .eq("id", params.id);
      if (error) throw error;

      const dataFormatada = new Date(params.data_alerta).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
      const conteudo = params.justificativa
        ? `Lembrete editado: nova data ${dataFormatada} — ${params.justificativa}`
        : `Lembrete editado: nova data ${dataFormatada}`;
      await supabase.from("atualizacoes").insert({
        atendimento_id: params.atendimento_id,
        usuario: "Sistema",
        conteudo,
        tipo: "comentario",
      });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
      queryClient.invalidateQueries({ queryKey: ["atendimento", vars.atendimento_id] });
    },
  });
}

export function useMarcarLida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notificacoes")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
      queryClient.invalidateQueries({ queryKey: ["atendimento"] });
    },
  });
}

export function useExcluirNotificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notificacoes")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
      queryClient.invalidateQueries({ queryKey: ["atendimento"] });
    },
  });
}
