"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido. O Sovina exige precisão."),
});

// Rate-limit best-effort por IP (in-memory, por instância serverless). Reduz
// rajadas de inscrição abusiva sem infra extra. Para um limite forte e global,
// migrar para um store compartilhado (ex.: Upstash) — registrado como debt M3.
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > RATE_LIMIT;
}

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

  // Rate-limit por IP (anti-abuso na rota aberta de inscrição).
  const hdrs = await headers();
  const ip =
    (hdrs.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "Muitas tentativas. Aguarde um pouco." };
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
