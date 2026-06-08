// Fatura como VISÃO DERIVADA: soma dos gastos (custos fixos + lançamentos)
// marcados com um cartão dentro do ciclo de fechamento. Nunca é um lançamento.
//
// Ciclo: a fatura fecha no `closing_day`. O ciclo aberto vai do dia seguinte
// ao fechamento anterior até o próximo fechamento (inclusive). Custos fixos do
// cartão são recorrentes — entram integralmente na fatura do ciclo.

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const clampDay = (y: number, m: number, day: number) =>
  Math.min(day, daysInMonth(y, m));

export interface Cycle {
  start: string; // ISO
  end: string; // ISO (fechamento)
}

/** Ciclo de fatura aberto na data informada. */
export function currentCycle(closingDay: number | null, today: Date): Cycle {
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();

  // sem dia de fechamento → cai no mês corrente
  if (!closingDay) {
    return { start: iso(new Date(y, m, 1)), end: iso(new Date(y, m + 1, 0)) };
  }

  const cdThis = clampDay(y, m, closingDay);
  let endY = y;
  let endM = m;
  if (d > cdThis) {
    endM = m + 1;
    endY = endM > 11 ? y + 1 : y;
    endM = endM % 12;
  }
  const end = new Date(endY, endM, clampDay(endY, endM, closingDay));

  // dia seguinte ao fechamento anterior
  let pM = endM - 1;
  let pY = endY;
  if (pM < 0) {
    pM = 11;
    pY -= 1;
  }
  const start = new Date(pY, pM, clampDay(pY, pM, closingDay) + 1);

  return { start: iso(start), end: iso(end) };
}

/** Vencimento da fatura que fecha em `cycleEnd`. */
export function dueDateFor(
  closingDay: number | null,
  dueDay: number | null,
  cycleEnd: string,
): string | null {
  if (!dueDay) return null;
  const [ey, em] = cycleEnd.split("-").map(Number); // em é 1-based
  let dy = ey;
  let dm = em - 1; // 0-based (mês do fechamento)
  if (dueDay < (closingDay ?? 31)) {
    dm += 1;
    if (dm > 11) {
      dm = 0;
      dy += 1;
    }
  }
  return iso(new Date(dy, dm, clampDay(dy, dm, dueDay)));
}

export interface StatementItem {
  kind: "fixed" | "tx";
  label: string;
  valor: number;
  date: string | null;
}

export interface Statement {
  cardId: string;
  cardName: string;
  total: number;
  start: string;
  end: string;
  due: string | null;
  limit: number | null;
  items: StatementItem[];
}

export interface StatementCardInput {
  id: string;
  nome: string;
  closing_day: number | null;
  due_day: number | null;
  limit_amount: number | null;
}

export function computeStatement(
  card: StatementCardInput,
  txs: {
    card_id: string | null;
    descricao: string | null;
    categoria: string;
    valor: number;
    occurred_at: string;
  }[],
  fixed: {
    card_id: string | null;
    label: string | null;
    categoria: string;
    valor: number;
  }[],
  today: Date,
): Statement {
  const cycle = currentCycle(card.closing_day, today);

  const fixedItems: StatementItem[] = fixed
    .filter((f) => f.card_id === card.id)
    .map((f) => ({
      kind: "fixed",
      label: f.label || f.categoria || "Custo fixo",
      valor: Number(f.valor),
      date: null,
    }));

  const txItems: StatementItem[] = txs
    .filter(
      (t) =>
        t.card_id === card.id &&
        t.occurred_at >= cycle.start &&
        t.occurred_at <= cycle.end,
    )
    .map((t) => ({
      kind: "tx",
      label: t.descricao || t.categoria || "Lançamento",
      valor: Number(t.valor),
      date: t.occurred_at,
    }));

  const items = [...fixedItems, ...txItems];
  return {
    cardId: card.id,
    cardName: card.nome || "Sem nome",
    total: round2(items.reduce((s, i) => s + i.valor, 0)),
    start: cycle.start,
    end: cycle.end,
    due: dueDateFor(card.closing_day, card.due_day, cycle.end),
    limit: card.limit_amount,
    items,
  };
}
