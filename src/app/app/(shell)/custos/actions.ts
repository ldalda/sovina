"use server";

import { createClient } from "@/lib/supabase/server";
import type { CellValue, CustomColumn, FixedCostRow } from "./types";

async function requireUid() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sessão expirada. Entre de novo.");
  return { supabase, uid: user.id };
}

async function nextPosition(
  table: "fixed_costs" | "custom_columns",
  uid: string,
  extra?: Record<string, string>,
) {
  const supabase = await createClient();
  let q = supabase
    .from(table)
    .select("position")
    .eq("user_id", uid)
    .order("position", { ascending: false })
    .limit(1);
  for (const [k, v] of Object.entries(extra ?? {})) q = q.eq(k, v);
  const { data } = await q.maybeSingle();
  return (data?.position ?? -1) + 1;
}

/* ── Linhas ─────────────────────────────────────────────────────────── */
export async function createCost(competencia: string): Promise<FixedCostRow> {
  const { supabase, uid } = await requireUid();
  const position = await nextPosition("fixed_costs", uid);
  const { data, error } = await supabase
    .from("fixed_costs")
    .insert({ user_id: uid, categoria: "", tipo: "", valor: 0, position, competencia })
    .select(
      "id,label,categoria,tipo,valor,due_date,payment_method,card_id,custom,position",
    )
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as FixedCostRow;
}

export async function updateCost(
  id: string,
  patch: Partial<{
    label: string | null;
    categoria: string;
    tipo: string;
    valor: number;
    due_date: string | null;
    payment_method: string;
    card_id: string | null;
    custom: Record<string, CellValue>;
  }>,
) {
  const { supabase, uid } = await requireUid();
  const { error } = await supabase
    .from("fixed_costs")
    .update(patch)
    .eq("id", id)
    .eq("user_id", uid);
  if (error) throw new Error(error.message);
}

export async function deleteCost(id: string) {
  const { supabase, uid } = await requireUid();
  const { error } = await supabase
    .from("fixed_costs")
    .delete()
    .eq("id", id)
    .eq("user_id", uid);
  if (error) throw new Error(error.message);
}

/* ── Colunas customizadas ───────────────────────────────────────────── */
export async function addColumn(input: {
  label: string;
  type: CustomColumn["type"];
}): Promise<CustomColumn> {
  const { supabase, uid } = await requireUid();
  const position = await nextPosition("custom_columns", uid, {
    table_key: "fixed_costs",
  });
  const key = "c_" + crypto.randomUUID().slice(0, 8);
  const { data, error } = await supabase
    .from("custom_columns")
    .insert({
      user_id: uid,
      table_key: "fixed_costs",
      key,
      label: input.label,
      type: input.type,
      position,
    })
    .select("id,key,label,type,position")
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as CustomColumn;
}

export async function deleteColumn(id: string) {
  const { supabase, uid } = await requireUid();
  const { error } = await supabase
    .from("custom_columns")
    .delete()
    .eq("id", id)
    .eq("user_id", uid);
  if (error) throw new Error(error.message);
}

/* ── Categorias (tipos) ─────────────────────────────────────────────── */
export async function createCategory(name: string) {
  const { supabase, uid } = await requireUid();
  await supabase
    .from("categories")
    .upsert(
      { user_id: uid, scope: "fixed_cost", name },
      { onConflict: "user_id,scope,name", ignoreDuplicates: true },
    );
}
