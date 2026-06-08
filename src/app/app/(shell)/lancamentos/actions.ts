"use server";

import { createClient } from "@/lib/supabase/server";
import type { Transaction } from "./types";

async function requireUid() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sessão expirada. Entre de novo.");
  return { supabase, uid: user.id };
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const pad = (n: number) => String(n).padStart(2, "0");

/** Soma k meses a uma data ISO, ajustando o dia ao fim do mês quando preciso. */
function addMonths(isoDate: string, k: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const base = new Date(y, m - 1 + k, 1);
  const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const dt = new Date(base.getFullYear(), base.getMonth(), Math.min(d, dim));
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

const ROW_COLS =
  "id,valor,descricao,categoria,occurred_at,payment_method,card_id,purchase_id,installment_no,installments_total";

export async function createTransaction(input: {
  valor: number; // valor TOTAL da compra
  descricao: string;
  categoria: string;
  occurred_at: string;
  payment_method: string;
  card_id: string | null;
  installments?: number; // nº de parcelas (1 = à vista)
}): Promise<Transaction[]> {
  const { supabase, uid } = await requireUid();
  const descricao = input.descricao.trim() || null;
  const n = Math.max(1, Math.floor(input.installments ?? 1));

  // à vista
  if (n === 1) {
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: uid,
        valor: input.valor,
        descricao,
        categoria: input.categoria,
        occurred_at: input.occurred_at,
        payment_method: input.payment_method,
        card_id: input.card_id,
      })
      .select(ROW_COLS)
      .single();
    if (error) throw new Error(error.message);
    return [data as unknown as Transaction];
  }

  // parcelado: N linhas (uma por mês), valor = total ÷ N (última ajusta o resto)
  const per = round2(input.valor / n);
  const purchaseId = crypto.randomUUID();
  const rows = Array.from({ length: n }, (_, k) => ({
    user_id: uid,
    valor: k < n - 1 ? per : round2(input.valor - per * (n - 1)),
    descricao,
    categoria: input.categoria,
    occurred_at: addMonths(input.occurred_at, k),
    payment_method: input.payment_method,
    card_id: input.card_id,
    purchase_id: purchaseId,
    installment_no: k + 1,
    installments_total: n,
  }));

  const { data, error } = await supabase
    .from("transactions")
    .insert(rows)
    .select(ROW_COLS);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Transaction[];
}

export async function deleteTransaction(id: string) {
  const { supabase, uid } = await requireUid();
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", uid);
  if (error) throw new Error(error.message);
}

/** Remove uma compra parcelada inteira (todas as parcelas). */
export async function deletePurchase(purchaseId: string) {
  const { supabase, uid } = await requireUid();
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("purchase_id", purchaseId)
    .eq("user_id", uid);
  if (error) throw new Error(error.message);
}
