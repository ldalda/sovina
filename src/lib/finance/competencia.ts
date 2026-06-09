import "server-only";
import type { createClient } from "@/lib/supabase/server";

type SB = Awaited<ReturnType<typeof createClient>>;

const pad = (n: number) => String(n).padStart(2, "0");

/** Primeiro dia do mês (competência) em ISO. */
export function monthStart(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
}

/**
 * Garante que o mês `competencia` tem custos fixos — replicando do mês anterior
 * mais recente se ainda estiver vazio. Idempotente (não duplica). Fixo replica
 * com o valor; Variável replica zerado (a confirmar).
 */
export async function ensureFixedCostsMonth(
  sb: SB,
  uid: string,
  competencia: string,
): Promise<void> {
  const { count } = await sb
    .from("fixed_costs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", uid)
    .eq("competencia", competencia);
  if ((count ?? 0) > 0) return;

  const { data: src } = await sb
    .from("fixed_costs")
    .select("competencia")
    .eq("user_id", uid)
    .lt("competencia", competencia)
    .order("competencia", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!src) return; // nada anterior pra replicar

  const { data: rows } = await sb
    .from("fixed_costs")
    .select("label,categoria,tipo,valor,due_date,payment_method,card_id,custom,position")
    .eq("user_id", uid)
    .eq("competencia", src.competencia);
  if (!rows?.length) return;

  const [ty, tm] = competencia.split("-").map(Number);
  const lastDay = new Date(ty, tm, 0).getDate();

  const insert = rows.map((r) => ({
    user_id: uid,
    label: r.label,
    categoria: r.categoria,
    tipo: r.tipo,
    valor: r.tipo === "Variável" ? 0 : r.valor,
    due_date: r.due_date
      ? `${ty}-${pad(tm)}-${pad(Math.min(Number(r.due_date.split("-")[2]), lastDay))}`
      : null,
    payment_method: r.payment_method,
    card_id: r.card_id,
    custom: r.custom,
    position: r.position,
    competencia,
  }));

  await sb.from("fixed_costs").insert(insert);
}
