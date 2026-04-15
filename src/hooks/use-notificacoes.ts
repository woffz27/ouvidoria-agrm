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
        { event: "*", schema: "public", table: "notificacoes", filter: `user_id=eq.${user.id}` },
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
      return data as Notificacao[];
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

      // Register in the ticket history
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

export function useMarcarLida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Mark as read then delete from notifications
      const { error: delError } = await supabase
        .from("notificacoes")
        .delete()
        .eq("id", id);
      if (delError) throw delError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificacoes"] });
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
    },
  });
}
