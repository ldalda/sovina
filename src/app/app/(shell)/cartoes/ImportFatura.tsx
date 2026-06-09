"use client";

import { useState, useTransition } from "react";
import { formatBRL } from "@/lib/format";
import type { PaymentCard } from "@/lib/finance/payment";
import type { StatementLine } from "@/lib/ai/statement-parser";
import {
  confirmImport,
  processStatement,
  type ImportProposal,
} from "./import-actions";

const brShort = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
};

export function ImportFatura({ cards }: { cards: PaymentCard[] }) {
  const [cardId, setCardId] = useState(cards[0]?.id ?? "");
  const [proposal, setProposal] = useState<ImportProposal | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  if (cards.length === 0) return null;

  function analisar(form: HTMLFormElement) {
    setError(null);
    setDone(null);
    const data = new FormData(form);
    startTransition(async () => {
      try {
        const p = await processStatement(data);
        setProposal(p);
        setChecked(new Set(p.novos.map((_, i) => i))); // todos marcados
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao ler a fatura.");
      }
    });
  }

  function confirmar() {
    if (!proposal) return;
    const items: StatementLine[] = proposal.novos.filter((_, i) =>
      checked.has(i),
    );
    startTransition(async () => {
      try {
        const n = await confirmImport(proposal.cardId, items);
        setDone(n);
        setProposal(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao importar.");
      }
    });
  }

  return (
    <div className="border border-line bg-concreto/20 p-6 max-w-2xl">
      <p className="text-subtle text-xs uppercase tracking-[0.25em] mb-1">
        Importar fatura (PDF)
      </p>
      <p className="text-dim text-sm mb-4">
        O Sovina lê a fatura, ignora o que você já lançou e propõe só os gastos
        que faltam. Sem duplicar nada.
      </p>

      {!proposal && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            analisar(e.currentTarget);
          }}
          className="flex flex-col gap-3"
        >
          <select
            name="cardId"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            className="bg-abismo border border-line focus:border-solar outline-none px-3 py-2 text-fg text-sm"
          >
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome || "Sem nome"}
              </option>
            ))}
          </select>
          <input
            type="file"
            name="file"
            accept="application/pdf"
            required
            className="text-sm text-dim file:mr-3 file:border file:border-line file:bg-abismo file:text-fg file:px-3 file:py-1.5 file:text-sm hover:file:border-solar"
          />
          <button
            type="submit"
            disabled={pending}
            className="bg-solar text-abismo py-2.5 font-bold tracking-tight hover:bg-solar/90 transition-colors disabled:opacity-50"
          >
            {pending ? "Lendo a fatura…" : "Analisar fatura"}
          </button>
        </form>
      )}

      {error && (
        <p className="mt-4 text-furia text-sm border-l-2 border-furia pl-3">
          {error}
        </p>
      )}

      {done !== null && (
        <p className="mt-2 text-sm text-dim border-l-2 border-solar pl-3">
          {done === 0
            ? "Nada novo a importar — sua fatura já estava toda lançada."
            : `Importados ${done} lançamento(s). O Sovina já contabilizou.`}
        </p>
      )}

      {proposal && (
        <div>
          <p className="text-dim text-sm mb-3">
            <span className="text-fg">{proposal.matchedCount}</span> já
            registrados ·{" "}
            <span className="text-solar">{proposal.novos.length}</span> novos
          </p>

          {proposal.novos.length === 0 ? (
            <p className="text-subtle text-sm">
              Tudo já estava lançado. Nada a importar.
            </p>
          ) : (
            <ul className="flex flex-col mb-4 max-h-72 overflow-y-auto">
              {proposal.novos.map((it, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-line/50 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={checked.has(i)}
                    onChange={(e) =>
                      setChecked((s) => {
                        const n = new Set(s);
                        if (e.target.checked) n.add(i);
                        else n.delete(i);
                        return n;
                      })
                    }
                    className="accent-solar"
                  />
                  <span className="flex-1 truncate text-fg">
                    {it.description}
                    <span className="text-subtle"> · {brShort(it.date)}</span>
                    {it.installmentTotal && it.installmentTotal > 1 && (
                      <span className="text-solar">
                        {" "}
                        · {it.installmentCurrent}/{it.installmentTotal}
                      </span>
                    )}
                  </span>
                  <span className="tabular-nums text-fg">
                    {formatBRL(it.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={confirmar}
              disabled={pending || checked.size === 0}
              className="bg-solar text-abismo px-5 py-2 text-sm font-bold tracking-tight hover:bg-solar/90 transition-colors disabled:opacity-40"
            >
              {pending ? "Importando…" : `Importar ${checked.size} selecionado(s)`}
            </button>
            <button
              type="button"
              onClick={() => setProposal(null)}
              className="px-4 py-2 text-sm text-dim hover:text-fg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
