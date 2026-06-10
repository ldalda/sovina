"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido. O Sovina exige precisão."),
});

export type WaitlistState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "joined"; email: string }
  | { status: "already"; email: string };

// Captura de e-mail da waitlist de pré-lançamento. Grava no Supabase via anon
// key — a RLS só permite INSERT, então não há leitura nem vazamento da lista.
export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }
  const { email } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("waitlist")
    .insert({ email, source: "landing" });

  if (error) {
    // 23505 = unique_violation → e-mail já registrado. Tratamos como idempotente.
    if (error.code === "23505") {
      return { status: "already", email };
    }
    return { status: "error", message: "Algo travou. Tente de novo." };
  }

  return { status: "joined", email };
}
