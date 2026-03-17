export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      atendimentos: {
        Row: {
          arquivos: string[] | null
          assunto: string
          canal: Database["public"]["Enums"]["canal_type"]
          categoria: Database["public"]["Enums"]["categoria_type"]
          cep: string | null
          data_abertura: string
          data_atualizacao: string
          descricao: string
          email: string | null
          id: string
          matricula_imovel: string | null
          ordem_servico_caern: string | null
          prazo_resolucao: string | null
          protocolo: string
          solicitante: string
          status: Database["public"]["Enums"]["status_type"]
          telefone: string | null
          tipo_problema: Database["public"]["Enums"]["tipo_problema_type"]
        }
        Insert: {
          arquivos?: string[] | null
          assunto: string
          canal: Database["public"]["Enums"]["canal_type"]
          categoria: Database["public"]["Enums"]["categoria_type"]
          cep?: string | null
          data_abertura?: string
          data_atualizacao?: string
          descricao: string
          email?: string | null
          id?: string
          matricula_imovel?: string | null
          ordem_servico_caern?: string | null
          prazo_resolucao?: string | null
          protocolo: string
          solicitante: string
          status?: Database["public"]["Enums"]["status_type"]
          telefone?: string | null
          tipo_problema?: Database["public"]["Enums"]["tipo_problema_type"]
        }
        Update: {
          arquivos?: string[] | null
          assunto?: string
          canal?: Database["public"]["Enums"]["canal_type"]
          categoria?: Database["public"]["Enums"]["categoria_type"]
          cep?: string | null
          data_abertura?: string
          data_atualizacao?: string
          descricao?: string
          email?: string | null
          id?: string
          matricula_imovel?: string | null
          ordem_servico_caern?: string | null
          prazo_resolucao?: string | null
          protocolo?: string
          solicitante?: string
          status?: Database["public"]["Enums"]["status_type"]
          telefone?: string | null
          tipo_problema?: Database["public"]["Enums"]["tipo_problema_type"]
        }
        Relationships: []
      }
      atualizacoes: {
        Row: {
          arquivos: string[] | null
          atendimento_id: string
          conteudo: string
          data: string
          id: string
          tipo: Database["public"]["Enums"]["atualizacao_tipo"]
          usuario: string
        }
        Insert: {
          arquivos?: string[] | null
          atendimento_id: string
          conteudo: string
          data?: string
          id?: string
          tipo?: Database["public"]["Enums"]["atualizacao_tipo"]
          usuario: string
        }
        Update: {
          arquivos?: string[] | null
          atendimento_id?: string
          conteudo?: string
          data?: string
          id?: string
          tipo?: Database["public"]["Enums"]["atualizacao_tipo"]
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "atualizacoes_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string
          created_at: string
          id: string
          nome_completo: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string
          created_at?: string
          id: string
          nome_completo?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cargo?: string
          created_at?: string
          id?: string
          nome_completo?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      atualizacao_tipo: "comentario" | "status_change"
      canal_type: "site" | "whatsapp" | "telefone"
      categoria_type: "reclamacao" | "sugestao" | "elogio" | "solicitacao"
      status_type: "aberto" | "em_andamento" | "respondido" | "finalizado"
      tipo_problema_type:
        | "extravasamento_esgoto"
        | "vazamento_agua"
        | "pavimentacao"
        | "outros"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      atualizacao_tipo: ["comentario", "status_change"],
      canal_type: ["site", "whatsapp", "telefone"],
      categoria_type: ["reclamacao", "sugestao", "elogio", "solicitacao"],
      status_type: ["aberto", "em_andamento", "respondido", "finalizado"],
      tipo_problema_type: [
        "extravasamento_esgoto",
        "vazamento_agua",
        "pavimentacao",
        "outros",
      ],
    },
  },
} as const
