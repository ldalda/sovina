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
  // Honeypot: humano não vê o campo. Bot que preencher recebe um "sucesso"
  // falso e nada é gravado — sem dica de que foi detectado.
  if (formData.get("website")) {
    return { status: "joined", email: String(formData.get("email") ?? "") };
  }

  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }
  const { email } = parsed.data;

  // origem do tráfego (?src=threads|ig|...) — só valores simples; resto vira 'landing'
  const rawSrc = String(formData.get("src") ?? "")
    .trim()
    .toLowerCase();
  const source = /^[a-z0-9_-]{1,32}$/.test(rawSrc) ? rawSrc : "landing";

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist").insert({ email, source });

  if (error) {
    // 23505 = unique_violation → e-mail já registrado. Tratamos como idempotente.
    if (error.code === "23505") {
      return { status: "already", email };
    }
    return { status: "error", message: "Algo travou. Tente de novo." };
  }

  return { status: "joined", email };
}
