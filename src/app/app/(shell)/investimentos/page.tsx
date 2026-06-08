import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { INVESTMENT_TYPES } from "@/lib/finance/categories";
import { IncomeTable } from "../_income/IncomeTable";
import type { CustomColumn, IncomeRow } from "../_income/types";

export default async function InvestimentosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const uid = user.id;

  const [invRes, colsRes, catsRes] = await Promise.all([
    supabase
      .from("income_sources")
      .select("id,label,tipo,valor,custom,position")
      .eq("user_id", uid)
      .eq("section", "investment")
      .order("position"),
    supabase
      .from("custom_columns")
      .select("id,key,label,type,position")
      .eq("user_id", uid)
      .eq("table_key", "income_investment")
      .order("position"),
    supabase
      .from("categories")
      .select("name")
      .eq("user_id", uid)
      .eq("scope", "income")
      .order("name"),
  ]);

  const investmentTypes = Array.from(
    new Set([...INVESTMENT_TYPES, ...(catsRes.data ?? []).map((c) => c.name)]),
  );

  return (
    <main className="flex-1 px-8 py-10 overflow-auto">
      <p className="text-solar text-xs uppercase tracking-[0.3em] mb-2">
        Investimentos
      </p>
      <h1 className="font-display text-3xl uppercase mb-8">Seu patrimônio</h1>

      <IncomeTable
        title="Carteira"
        hint="Não entra na cota — é o destino da sua poupança."
        section="investment"
        tableKey="income_investment"
        labelHeader="Ativo"
        showTipo
        tipoOptions={investmentTypes}
        initialRows={(invRes.data ?? []) as unknown as IncomeRow[]}
        initialColumns={(colsRes.data ?? []) as unknown as CustomColumn[]}
      />
    </main>
  );
}
