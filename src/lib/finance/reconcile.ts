import type { StatementLine } from "@/lib/ai/statement-parser";

// Item já existente no app (lançamento ou custo fixo) atribuído ao cartão.
export interface ExistingItem {
  kind: "tx" | "fixed";
  date: string | null; // ISO; null para custos fixos (recorrentes)
  valor: number;
}

export interface Reconciliation {
  /** itens da fatura que já estão registrados (não recriar) */
  matched: StatementLine[];
  /** itens da fatura ainda não registrados (propor criação) */
  novos: StatementLine[];
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.abs(da - db) / 86_400_000;
}

// Casa cada linha da fatura com no máximo um item existente (greedy):
// mesmo valor (±1 centavo) e data próxima (±3 dias). Custos fixos casam só
// pelo valor (são recorrentes, sem data de ocorrência). Evita usar o mesmo
// item existente para duas linhas.
export function reconcile(
  lines: StatementLine[],
  existing: ExistingItem[],
  toleranceDays = 3,
): Reconciliation {
  const used = new Set<number>();
  const matched: StatementLine[] = [];
  const novos: StatementLine[] = [];

  for (const line of lines) {
    let hit = -1;
    for (let i = 0; i < existing.length; i++) {
      if (used.has(i)) continue;
      const e = existing[i];
      if (Math.abs(e.valor - line.amount) > 0.005) continue;
      const dateOk =
        e.kind === "fixed" ||
        (e.date != null && daysBetween(e.date, line.date) <= toleranceDays);
      if (dateOk) {
        hit = i;
        break;
      }
    }
    if (hit >= 0) {
      used.add(hit);
      matched.push(line);
    } else {
      novos.push(line);
    }
  }

  return { matched, novos };
}
