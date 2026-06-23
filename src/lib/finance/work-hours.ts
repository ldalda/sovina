// Traduz um gasto em "horas de trabalho" — a intervenção comportamental central
// do Sovina ("você troca X horas do seu suor por isso"). Baseado na renda
// mensal declarada (receivables) e numa jornada de referência.
//
// Base: 22 dias úteis × 8h = 176h/mês. Coerente com a conversão em "dias de
// trabalho" (horas ÷ 8). É metáfora de impacto, não folha de pagamento — pode
// virar configurável (autônomos, jornadas diferentes) como fast-follow.

const HOURS_PER_MONTH = 176;
const HOURS_PER_DAY = 8;

/** Horas de trabalho que o gasto custou. null se não dá pra calcular. */
export function workHours(valor: number, monthlyIncome: number): number | null {
  if (!monthlyIncome || monthlyIncome <= 0 || valor <= 0) return null;
  const hourly = monthlyIncome / HOURS_PER_MONTH;
  return valor / hourly;
}

/** Formato curto e legível: "45min", "2h30", "1 dia de trabalho", "3,5 dias de trabalho". */
export function formatWorkHours(hours: number): string {
  if (hours < 1) {
    return `${Math.max(1, Math.round(hours * 60))}min`;
  }
  if (hours < HOURS_PER_DAY) {
    const h = Math.floor(hours);
    const min = Math.round((hours - h) * 60);
    return min > 0 ? `${h}h${String(min).padStart(2, "0")}` : `${h}h`;
  }
  const dias = hours / HOURS_PER_DAY;
  const d = dias < 10 ? Math.round(dias * 10) / 10 : Math.round(dias);
  const label = d.toLocaleString("pt-BR");
  return `${label} ${d === 1 ? "dia" : "dias"} de trabalho`;
}

/** Atalho: calcula e formata, ou null. */
export function workHoursLabel(
  valor: number,
  monthlyIncome: number,
): string | null {
  const h = workHours(valor, monthlyIncome);
  return h === null ? null : formatWorkHours(h);
}
