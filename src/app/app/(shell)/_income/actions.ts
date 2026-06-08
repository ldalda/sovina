"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  CellValue,
  CustomColumn,
  IncomeRow,
  IncomeSection,
  IncomeTableKey,
} from "./types";

async function requireUid() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sessão expirada. Entre de novo.");
  return { supabase, uid: user.id };
}

/* ── Linhas ─────────────────────────────────────────────────────────── */
export async function createIncome(
  section: IncomeSection,
): Promise<IncomeRow> {
  const { supabase, uid } = await requireUid();
  const { data: last } = await supabase
    .from("income_sources")
    .select("position")
    .eq("user_id", uid)
    .eq("section", section)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? -1) + 1;
  const { data, error } = await supabase
    .from("income_sources")
    .insert({ user_id: uid, section, tipo: "", valor: 0, position })
    .select("id,label,tipo,valor,custom,position")
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as IncomeRow;
}

export async function updateIncome(
  id: string,
  patch: Partial<{
    label: string | null;
    tipo: string;
    valor: number;
    custom: Record<string, CellValue>;
  }>,
) {
  const { supabase, uid } = await requireUid();
  const { error } = await supabase
    .from("income_sources")
    .update(patch)
    .eq("id", id)
    .eq("user_id", uid);
  if (error) throw new Error(error.message);
}

export async function deleteIncome(id: string) {
  const { supabase, uid } = await requireUid();
  const { error } = await supabase
    .from("income_sources")
    .delete()
    .eq("id", id)
    .eq("user_id", uid);
  if (error) throw new Error(error.message);
}

/* ── Colunas customizadas ───────────────────────────────────────────── */
export async function addColumn(
  tableKey: IncomeTableKey,
  input: { label: string; type: CustomColumn["type"] },
): Promise<CustomColumn> {
  const { supabase, uid } = await requireUid();
  const { data: last } = await supabase
    .from("custom_columns")
    .select("position")
    .eq("user_id", uid)
    .eq("table_key", tableKey)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? -1) + 1;
  const key = "c_" + crypto.randomUUID().slice(0, 8);
  const { data, error } = await supabase
    .from("custom_columns")
    .insert({
      user_id: uid,
      table_key: tableKey,
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

/* ── Categorias (tipos de investimento) ─────────────────────────────── */
export async function createCategory(name: string) {
  const { supabase, uid } = await requireUid();
  await supabase
    .from("categories")
    .upsert(
      { user_id: uid, scope: "income", name },
      { onConflict: "user_id,scope,name", ignoreDuplicates: true },
    );
}
