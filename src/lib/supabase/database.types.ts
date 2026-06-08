// Stub inicial. Substituir por `supabase gen types typescript` quando o
// schema estabilizar. Manter como `any`-like neste estágio evita falsa
// segurança de tipos sobre tabelas que ainda não existem.
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
