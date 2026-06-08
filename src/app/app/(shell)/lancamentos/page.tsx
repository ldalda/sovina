import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EXPENSE_CATEGORIES } from "@/lib/finance/categories";
import { Lancamentos } from "./Lancamentos";
import type { Transaction } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");
const sumValor = (rows: { valor: number }[] | null) =>
  (rows ?? []).reduce((s, r) => s + Number(r.valor), 0);

export default async function LancamentosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const uid = user.id;

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthEnd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(lastDay)}`;
  const todayISO = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const [incomeRes, costsRes, profileRes, txRes, cardsRes] = await Promise.all([
    supabase
      .from("income_sources")
      .select("valor")
      .eq("user_id", uid)
      .eq("section", "receivable"),
    supabase.from("fixed_costs").select("valor").eq("user_id", uid),
    supabase
      .from("profiles")
      .select("savings_mode,savings_amount,savings_percent")
      .eq("id", uid)
      .single(),
    supabase
      .from("transactions")
      .select(
        "id,valor,descricao,categoria,occurred_at,payment_method,card_id,purchase_id,installment_no,installments_total",
      )
      .eq("user_id", uid)
      .gte("occurred_at", monthStart)
      .lte("occurred_at", monthEnd)
      .order("occurred_at", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("cards")
      .select("id,nome")
      .eq("user_id", uid)
      .order("position"),
  ]);

  const profile = profileRes.data;

  return (
    <Lancamentos
      income={sumValor(incomeRes.data)}
      fixedCosts={sumValor(costsRes.data)}
      savingsMode={profile?.savings_mode ?? "percent"}
      savingsAmount={Number(profile?.savings_amount ?? 0)}
      savingsPercent={Number(profile?.savings_percent ?? 0)}
      todayISO={todayISO}
      initialTransactions={(txRes.data ?? []) as unknown as Transaction[]}
      categories={[...EXPENSE_CATEGORIES]}
      cards={cardsRes.data ?? []}
    />
  );
}
