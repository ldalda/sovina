"use server";

import { generateVerdict, type VerdictContext } from "@/lib/ai/verdict";
import { createClient } from "@/lib/supabase/server";

// O cliente monta tudo menos o histórico — esse é calculado aqui no server.
type ClientContext = Omit<VerdictContext, "priorCount" | "priorTotal">;

const pad = (n: number) => String(n).padStart(2, "0");

// Veredito do Sovina para um gasto recém-registrado. Conta o histórico da mesma
// categoria no mês (pra detectar padrão repetido) e tenta a IA (persona). Em
// QUALQUER falha, devolve o fallback determinístico. O fluxo nunca quebra.
export async function getVerdict(
  ctx: ClientContext,
  fallback: string,
): Promise<string> {
  try {
    let priorCount = 0;
    let priorTotal = 0;

    if (ctx.categoria) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const now = new Date();
        const monthStart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
        const { data } = await supabase
          .from("transactions")
          .select("valor")
          .eq("user_id", user.id)
          .eq("categoria", ctx.categoria)
          .gte("occurred_at", monthStart);
        priorCount = data?.length ?? 0;
        priorTotal = (data ?? []).reduce((s, r) => s + Number(r.valor), 0);
      }
    }

    const text = await generateVerdict({ ...ctx, priorCount, priorTotal });
    return text || fallback;
  } catch {
    return fallback;
  }
}
