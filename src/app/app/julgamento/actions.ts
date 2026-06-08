"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SavingsMode } from "@/lib/finance/quota";

export interface JulgamentoPayload {
  receivables: { label: string; valor: number }[];
  fixedCosts: { label: string; categoria: string; valor: number }[];
  savings: { mode: SavingsMode; amount: number; percent: number };
}

export async function submitJulgamento(payload: JulgamentoPayload) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const receivables = payload.receivables.filter((r) => r.valor > 0);
  const fixedCosts = payload.fixedCosts.filter((c) => c.valor > 0);

  if (receivables.length) {
    const { error } = await supabase.from("income_sources").insert(
      receivables.map((r, i) => ({
        user_id: user.id,
        section: "receivable" as const,
        label: r.label.trim() || null,
        valor: r.valor,
        position: i,
      })),
    );
    if (error) throw new Error(`Falha ao salvar recebíveis: ${error.message}`);
  }

  if (fixedCosts.length) {
    const { error } = await supabase.from("fixed_costs").insert(
      fixedCosts.map((c, i) => ({
        user_id: user.id,
        label: c.label.trim() || null,
        categoria: c.categoria,
        valor: c.valor,
        position: i,
      })),
    );
    if (error) throw new Error(`Falha ao salvar custos fixos: ${error.message}`);
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    savings_mode: payload.savings.mode,
    savings_amount: payload.savings.mode === "fixed" ? payload.savings.amount : 0,
    savings_percent:
      payload.savings.mode === "percent" ? payload.savings.percent : 0,
    onboarded_at: new Date().toISOString(),
  });
  if (error) throw new Error(`Falha ao decretar o julgamento: ${error.message}`);

  redirect("/app");
}
