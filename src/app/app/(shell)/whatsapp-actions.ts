"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Normaliza pra dígitos e valida formato BR (DDD + número, com ou sem 55).
// 10 dígitos (fixo antigo) a 13 (55 + DDD + 9 dígitos).
const schema = z.object({
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 13, {
      message: "Número inválido. Use DDD + número.",
    }),
  consent: z.literal("on", {
    message: "Sem consentimento, sem cobrança.",
  }),
});

export type WhatsAppState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "saved" };

// Captura o WhatsApp + opt-in no profile do próprio usuário. RLS own-profile
// garante que só o dono escreve. Registra whatsapp_optin_at como prova de
// consentimento (LGPD).
export async function saveWhatsApp(
  _prev: WhatsAppState,
  formData: FormData,
): Promise<WhatsAppState> {
  const parsed = schema.safeParse({
    whatsapp: formData.get("whatsapp"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Sessão expirada." };

  const { error } = await supabase
    .from("profiles")
    .update({
      whatsapp: parsed.data.whatsapp,
      whatsapp_optin_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { status: "error", message: "Algo travou. Tente de novo." };
  }

  revalidatePath("/app");
  return { status: "saved" };
}
