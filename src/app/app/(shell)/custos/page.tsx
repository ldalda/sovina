import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FIXED_COST_TYPES } from "@/lib/finance/categories";
import { CustosTable } from "./CustosTable";
import type { CustomColumn, FixedCostRow } from "./types";

export default async function CustosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const uid = user.id;

  const [rowsRes, colsRes, catsRes, cardsRes] = await Promise.all([
    supabase
      .from("fixed_costs")
      .select(
        "id,label,categoria,tipo,valor,due_date,payment_method,card_id,custom,position",
      )
      .eq("user_id", uid)
      .order("position"),
    supabase
      .from("custom_columns")
      .select("id,key,label,type,position")
      .eq("user_id", uid)
      .eq("table_key", "fixed_costs")
      .order("position"),
    supabase
      .from("categories")
      .select("name")
      .eq("user_id", uid)
      .eq("scope", "fixed_cost")
      .order("name"),
    supabase
      .from("cards")
      .select("id,nome")
      .eq("user_id", uid)
      .order("position"),
  ]);

  const categories = Array.from(
    new Set([
      ...FIXED_COST_TYPES,
      ...(catsRes.data ?? []).map((c) => c.name),
    ]),
  );

  return (
    <CustosTable
      initialRows={(rowsRes.data ?? []) as unknown as FixedCostRow[]}
      initialColumns={(colsRes.data ?? []) as unknown as CustomColumn[]}
      initialCategories={categories}
      cards={cardsRes.data ?? []}
    />
  );
}
