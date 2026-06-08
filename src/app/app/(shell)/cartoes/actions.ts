"use server";

import { createClient } from "@/lib/supabase/server";
import type { Card } from "./types";

async function requireUid() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sessão expirada. Entre de novo.");
  return { supabase, uid: user.id };
}

export async function createCard(): Promise<Card> {
  const { supabase, uid } = await requireUid();
  const { data: last } = await supabase
    .from("cards")
    .select("position")
    .eq("user_id", uid)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? -1) + 1;
  const { data, error } = await supabase
    .from("cards")
    .insert({ user_id: uid, nome: "", position })
    .select("id,nome,closing_day,due_day,limit_amount,position")
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as Card;
}

export async function updateCard(
  id: string,
  patch: Partial<{
    nome: string;
    closing_day: number | null;
    due_day: number | null;
    limit_amount: number | null;
  }>,
) {
  const { supabase, uid } = await requireUid();
  const { error } = await supabase
    .from("cards")
    .update(patch)
    .eq("id", id)
    .eq("user_id", uid);
  if (error) throw new Error(error.message);
}

export async function deleteCard(id: string) {
  const { supabase, uid } = await requireUid();
  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", id)
    .eq("user_id", uid);
  if (error) throw new Error(error.message);
}
