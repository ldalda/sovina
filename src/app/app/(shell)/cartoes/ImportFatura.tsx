"use client";

import { useState, useTransition } from "react";
import { formatBRL } from "@/lib/format";
import type { PaymentCard } from "@/lib/finance/payment";
import type { StatementLine } from "@/lib/ai/statement-parser";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Card className="max-w-2xl">
      <CardContent className="p-6">
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
          <input type="hidden" name="cardId" value={cardId} />
          <Select value={cardId} onValueChange={setCardId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha o cartão" />
            </SelectTrigger>
            <SelectContent>
              {cards.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome || "Sem nome"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="file"
            name="file"
            accept="application/pdf"
            required
            className="text-sm text-dim file:mr-3 file:border file:border-line file:bg-abismo file:text-fg file:px-3 file:py-1.5 file:text-sm hover:file:border-solar"
          />
          <Button
            type="submit"
            disabled={pending}
            className="font-bold tracking-tight"
          >
            {pending ? "Lendo a fatura…" : "Analisar fatura"}
          </Button>
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
            <Button
              type="button"
              onClick={confirmar}
              disabled={pending || checked.size === 0}
              className="font-bold tracking-tight"
            >
              {pending ? "Importando…" : `Importar ${checked.size} selecionado(s)`}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setProposal(null)}
              className="text-dim hover:text-fg"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  );
}
