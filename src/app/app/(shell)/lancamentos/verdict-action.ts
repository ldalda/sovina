"use server";

import { generateVerdict, type VerdictContext } from "@/lib/ai/verdict";

// Veredito do Sovina para um gasto recém-registrado. Tenta a IA (persona) e,
// em QUALQUER falha (sem chave, timeout, erro de rede), devolve o fallback
// determinístico que o cliente já calculou. O fluxo de registro nunca quebra.
export async function getVerdict(
  ctx: VerdictContext,
  fallback: string,
): Promise<string> {
  try {
    const text = await generateVerdict(ctx);
    return text || fallback;
  } catch {
    return fallback;
  }
}
