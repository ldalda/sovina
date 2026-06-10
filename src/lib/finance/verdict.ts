// Vereditos determinísticos — usados como FALLBACK quando a IA do Sovina não
// responde (sem chave, timeout, erro). Garantem que o fluxo nunca quebra: o
// usuário sempre recebe um veredito, mesmo que a persona via IA falhe.
import { formatBRL } from "@/lib/format";
import type { QuotaResult } from "./quota";

export function localVerdict(q: QuotaResult): string {
  if (q.leftTodayMax < 0) {
    return `Furou o teto do dia em ${formatBRL(-q.leftTodayMax)}. Amanhã sua cota encolhe. Eu avisei.`;
  }
  if (q.leftTodayIdeal < 0) {
    return `Passou da cota ideal. Restam ${formatBRL(
      q.leftTodayMax,
    )} até o teto — e isso é dívida com o seu futuro.`;
  }
  return `Registrado. Sobram ${formatBRL(q.leftTodayIdeal)} da sua cota hoje.`;
}

export function localInstallmentVerdict(n: number, per: number): string {
  return `Parcelado em ${n}x de ${formatBRL(
    per,
  )}. Eu não esqueço — cada mês vai cobrar a sua parte. A do mês já saiu da sua cota.`;
}
