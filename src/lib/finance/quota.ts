// Cálculo da cota diária do Sovina — modelo "dias restantes".
//
// Dois números regem o usuário:
//   • cota MÁXIMA  — gastar isso por dia zera o saldo exatamente no fim do mês
//   • cota IDEAL   — reserva a meta de poupança antes de dividir; gastar isso
//                    garante que sobra a meta guardada
//
// Regras de produto (ver memória project-sovina-dados):
//   • renda = soma dos Recebíveis (investimentos NÃO entram na cota)
//   • sobrevivência = renda − custos fixos
//   • dias restantes = de hoje até o último dia do mês, inclusive

export type SavingsMode = "fixed" | "percent";

export interface QuotaInput {
  /** soma dos Recebíveis no mês (R$) */
  income: number;
  /** soma dos custos fixos (R$) */
  fixedCosts: number;
  savingsMode: SavingsMode;
  /** meta em R$ — usado quando savingsMode = 'fixed' */
  savingsAmount?: number;
  /** meta em % da renda (0–100) — usado quando savingsMode = 'percent' */
  savingsPercent?: number;
  /** data de referência; default = agora */
  today?: Date;
  /**
   * saldo ainda disponível para gastar no mês (R$).
   * default = sobrevivência (no onboarding ainda não há gastos registrados).
   */
  spendableRemaining?: number;
}

export interface QuotaResult {
  /** renda − custos fixos */
  survival: number;
  /** meta de poupança resolvida em R$ */
  savingsTarget: number;
  daysInMonth: number;
  /** dias de hoje até o fim do mês, inclusive */
  daysRemaining: number;
  /** teto diário: gastar isso zera o saldo no fim do mês */
  maxDaily: number;
  /** diária que ainda assim guarda a meta de poupança */
  idealDaily: number;
  /** false quando a meta não cabe na sobrevivência (idealDaily ficaria negativo) */
  feasible: boolean;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Último dia do mês da data informada (28–31). */
export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Dias de `date` até o fim do mês, inclusive (mínimo 1). */
export function daysRemainingInMonth(date: Date): number {
  return Math.max(1, daysInMonth(date) - date.getDate() + 1);
}

export function resolveSavingsTarget(input: QuotaInput): number {
  if (input.savingsMode === "fixed") {
    return Math.max(0, input.savingsAmount ?? 0);
  }
  const pct = Math.min(100, Math.max(0, input.savingsPercent ?? 0));
  return round2((input.income * pct) / 100);
}

export function computeQuota(input: QuotaInput): QuotaResult {
  const today = input.today ?? new Date();
  const survival = round2(input.income - input.fixedCosts);
  const savingsTarget = resolveSavingsTarget(input);
  const remaining = daysRemainingInMonth(today);
  const spendable = input.spendableRemaining ?? survival;

  const maxDaily = round2(spendable / remaining);
  const idealDaily = round2((spendable - savingsTarget) / remaining);

  return {
    survival,
    savingsTarget,
    daysInMonth: daysInMonth(today),
    daysRemaining: remaining,
    maxDaily,
    idealDaily,
    feasible: savingsTarget <= survival,
  };
}
