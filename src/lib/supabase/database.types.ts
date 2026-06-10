// Tipos do schema do Sovina. Refletem `supabase/migrations/*_core_schema.sql`.
// Quando o projeto estiver linkado, regenerar com:
//   supabase gen types typescript --linked > src/lib/supabase/database.types.ts

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type SavingsMode = "fixed" | "percent";
export type CategoryScope = "fixed_cost" | "income";
export type IncomeSection = "receivable" | "investment";
export type CustomColumnType = "text" | "number" | "date" | "select";
export type CustomTableKey =
  | "fixed_costs"
  | "income_receivable"
  | "income_investment";

export type Database = {
  public: {
    Tables: {
      threads_reply_queue: {
        Row: {
          id: string;
          target_post_id: string;
          target_username: string;
          target_text: string;
          target_permalink: string | null;
          keyword: string;
          draft: string;
          status: string;
          threads_reply_id: string | null;
          error: string | null;
          created_at: string;
          decided_at: string | null;
          posted_at: string | null;
        };
        Insert: {
          id?: string;
          target_post_id: string;
          target_username: string;
          target_text: string;
          target_permalink?: string | null;
          keyword: string;
          draft: string;
          status?: string;
          threads_reply_id?: string | null;
          error?: string | null;
          created_at?: string;
          decided_at?: string | null;
          posted_at?: string | null;
        };
        Update: {
          id?: string;
          target_post_id?: string;
          target_username?: string;
          target_text?: string;
          target_permalink?: string | null;
          keyword?: string;
          draft?: string;
          status?: string;
          threads_reply_id?: string | null;
          error?: string | null;
          created_at?: string;
          decided_at?: string | null;
          posted_at?: string | null;
        };
        Relationships: [];
      };
      threads_queue: {
        Row: {
          id: string;
          body: string;
          scheduled_at: string;
          status: string;
          threads_post_id: string | null;
          error: string | null;
          posted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          body: string;
          scheduled_at: string;
          status?: string;
          threads_post_id?: string | null;
          error?: string | null;
          posted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          body?: string;
          scheduled_at?: string;
          status?: string;
          threads_post_id?: string | null;
          error?: string | null;
          posted_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          savings_mode: SavingsMode;
          savings_amount: number;
          savings_percent: number;
          cycle_anchor_day: number | null;
          onboarded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          savings_mode?: SavingsMode;
          savings_amount?: number;
          savings_percent?: number;
          cycle_anchor_day?: number | null;
          onboarded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          savings_mode?: SavingsMode;
          savings_amount?: number;
          savings_percent?: number;
          cycle_anchor_day?: number | null;
          onboarded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          scope: CategoryScope;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scope: CategoryScope;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          scope?: CategoryScope;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      fixed_costs: {
        Row: {
          id: string;
          user_id: string;
          label: string | null;
          categoria: string;
          tipo: string;
          valor: number;
          due_date: string | null;
          payment_method: string;
          card_id: string | null;
          competencia: string;
          custom: Json;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string | null;
          categoria?: string;
          tipo?: string;
          valor?: number;
          due_date?: string | null;
          payment_method?: string;
          card_id?: string | null;
          competencia?: string;
          custom?: Json;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string | null;
          categoria?: string;
          tipo?: string;
          valor?: number;
          due_date?: string | null;
          payment_method?: string;
          card_id?: string | null;
          competencia?: string;
          custom?: Json;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      income_sources: {
        Row: {
          id: string;
          user_id: string;
          section: IncomeSection;
          label: string | null;
          tipo: string;
          valor: number;
          custom: Json;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          section: IncomeSection;
          label?: string | null;
          tipo?: string;
          valor?: number;
          custom?: Json;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          section?: IncomeSection;
          label?: string | null;
          tipo?: string;
          valor?: number;
          custom?: Json;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cards: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          closing_day: number | null;
          due_day: number | null;
          limit_amount: number | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nome: string;
          closing_day?: number | null;
          due_day?: number | null;
          limit_amount?: number | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nome?: string;
          closing_day?: number | null;
          due_day?: number | null;
          limit_amount?: number | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          valor: number;
          descricao: string | null;
          categoria: string;
          occurred_at: string;
          source: string;
          payment_method: string;
          card_id: string | null;
          purchase_id: string | null;
          installment_no: number;
          installments_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          valor: number;
          descricao?: string | null;
          categoria?: string;
          occurred_at?: string;
          source?: string;
          payment_method?: string;
          card_id?: string | null;
          purchase_id?: string | null;
          installment_no?: number;
          installments_total?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          valor?: number;
          descricao?: string | null;
          categoria?: string;
          occurred_at?: string;
          source?: string;
          payment_method?: string;
          card_id?: string | null;
          purchase_id?: string | null;
          installment_no?: number;
          installments_total?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      custom_columns: {
        Row: {
          id: string;
          user_id: string;
          table_key: CustomTableKey;
          key: string;
          label: string;
          type: CustomColumnType;
          options: Json;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          table_key: CustomTableKey;
          key: string;
          label: string;
          type?: CustomColumnType;
          options?: Json;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          table_key?: CustomTableKey;
          key?: string;
          label?: string;
          type?: CustomColumnType;
          options?: Json;
          position?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      savings_mode: SavingsMode;
      category_scope: CategoryScope;
      income_section: IncomeSection;
      custom_column_type: CustomColumnType;
      custom_table_key: CustomTableKey;
    };
  };
};
