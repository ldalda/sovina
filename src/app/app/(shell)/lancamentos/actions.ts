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

export async function createTransaction(input: {
  valor: number;
  descricao: string;
  categoria: string;
  occurred_at: string;
  payment_method: string;
  card_id: string | null;
}): Promise<Transaction> {
  const { supabase, uid } = await requireUid();
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: uid,
      valor: input.valor,
      descricao: input.descricao.trim() || null,
      categoria: input.categoria,
      occurred_at: input.occurred_at,
      payment_method: input.payment_method,
      card_id: input.card_id,
    })
    .select("id,valor,descricao,categoria,occurred_at,payment_method,card_id")
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as Transaction;
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
