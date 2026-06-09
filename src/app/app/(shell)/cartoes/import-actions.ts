"use server";

import { createClient } from "@/lib/supabase/server";
import { parseStatementPdf, type StatementLine } from "@/lib/ai/statement-parser";
import { reconcile, type ExistingItem } from "@/lib/finance/reconcile";

async function requireUid() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sessão expirada. Entre de novo.");
  return { supabase, uid: user.id };
}

const pad = (n: number) => String(n).padStart(2, "0");
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

function addMonths(isoDate: string, k: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const base = new Date(y, m - 1 + k, 1);
  const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const dt = new Date(base.getFullYear(), base.getMonth(), Math.min(d, dim));
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

export interface ImportProposal {
  cardId: string;
  matchedCount: number;
  novos: StatementLine[];
}

/** Lê o PDF, reconcilia com o que já existe no cartão e devolve a proposta. */
export async function processStatement(
  formData: FormData,
): Promise<ImportProposal> {
  const { supabase, uid } = await requireUid();
  const cardId = String(formData.get("cardId") || "");
  const file = formData.get("file");
  if (!cardId) throw new Error("Escolha um cartão.");
  if (!(file instanceof File) || file.size === 0)
    throw new Error("Anexe o PDF da fatura.");

  const pdf = new Uint8Array(await file.arrayBuffer());
  const lines = await parseStatementPdf(pdf);

  // janela ampla: gastos do cartão nos últimos ~4 meses + custos fixos do cartão
  const since = new Date();
  since.setMonth(since.getMonth() - 4);
  const sinceISO = `${since.getFullYear()}-${pad(since.getMonth() + 1)}-01`;

  const [txRes, fixedRes] = await Promise.all([
    supabase
      .from("transactions")
      .select("valor,occurred_at")
      .eq("user_id", uid)
      .eq("card_id", cardId)
      .gte("occurred_at", sinceISO),
    supabase
      .from("fixed_costs")
      .select("valor")
      .eq("user_id", uid)
      .eq("card_id", cardId),
  ]);

  const existing: ExistingItem[] = [
    ...(txRes.data ?? []).map((t) => ({
      kind: "tx" as const,
      date: t.occurred_at,
      valor: Number(t.valor),
    })),
    ...(fixedRes.data ?? []).map((f) => ({
      kind: "fixed" as const,
      date: null,
      valor: Number(f.valor),
    })),
  ];

  const { matched, novos } = reconcile(lines, existing);
  return { cardId, matchedCount: matched.length, novos };
}

/** Cria os lançamentos confirmados (source='fatura'). Parcela gera as futuras. */
export async function confirmImport(
  cardId: string,
  items: StatementLine[],
): Promise<number> {
  const { supabase, uid } = await requireUid();
  if (!items.length) return 0;

  type Row = {
    user_id: string;
    valor: number;
    descricao: string | null;
    categoria: string;
    occurred_at: string;
    payment_method: string;
    card_id: string;
    source: string;
    purchase_id?: string;
    installment_no?: number;
    installments_total?: number;
  };
  const rows: Row[] = [];

  for (const it of items) {
    const base = {
      user_id: uid,
      descricao: it.description.trim() || null,
      categoria: "",
      payment_method: "credit",
      card_id: cardId,
      source: "fatura",
    };
    const total = it.installmentTotal ?? 1;
    const current = it.installmentCurrent ?? 1;

    if (total > 1 && current <= total) {
      // gera a parcela atual + as futuras (as passadas não recriamos)
      const purchase_id = crypto.randomUUID();
      for (let n = current; n <= total; n++) {
        rows.push({
          ...base,
          valor: it.amount,
          occurred_at: addMonths(it.date, n - current),
          purchase_id,
          installment_no: n,
          installments_total: total,
        });
      }
    } else {
      rows.push({ ...base, valor: round2(it.amount), occurred_at: it.date });
    }
  }

  const { error } = await supabase.from("transactions").insert(rows);
  if (error) throw new Error(error.message);
  return rows.length;
}
