"use client";

import { useMemo, useState, useTransition } from "react";
import { TypeCombobox } from "@/components/TypeCombobox";
import { SelectMenu } from "@/components/SelectMenu";
import { DateField } from "@/components/DateField";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { computeQuota, type QuotaResult, type SavingsMode } from "@/lib/finance/quota";
import {
  decodePayment,
  paymentLabel,
  paymentOptions,
  type PaymentCard,
} from "@/lib/finance/payment";
import { formatBRL } from "@/lib/format";
import {
  createTransaction,
  deletePurchase,
  deleteTransaction,
} from "./actions";
import { getVerdict } from "./verdict-action";
import { localInstallmentVerdict, localVerdict } from "@/lib/finance/verdict";
import { workHours, workHoursLabel } from "@/lib/finance/work-hours";
import type { Transaction } from "./types";

function isoToBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function Lancamentos({
  income,
  fixedCosts,
  savingsMode,
  savingsAmount,
  savingsPercent,
  todayISO,
  initialTransactions,
  categories: initialCategories,
  cards,
}: {
  income: number;
  fixedCosts: number;
  savingsMode: SavingsMode;
  savingsAmount: number;
  savingsPercent: number;
  todayISO: string;
  initialTransactions: Transaction[];
  categories: string[];
  cards: PaymentCard[];
}) {
  const [txs, setTxs] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [valor, setValor] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [pagamento, setPagamento] = useState("cash");
  const [data, setData] = useState(todayISO);
  const [installments, setInstallments] = useState(1);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [verdictLoading, setVerdictLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  const today = useMemo(() => new Date(todayISO + "T00:00:00"), [todayISO]);
  const currentMonth = todayISO.slice(0, 7);
  const isCard = pagamento.startsWith("card:");

  function quotaFrom(list: Transaction[]): QuotaResult {
    // gastos à vista consomem a cota do dia; parcelas são compromisso do mês
    const cash = list.filter((t) => t.installments_total === 1);
    const inst = list.filter((t) => t.installments_total > 1);
    const spentToday = cash
      .filter((t) => t.occurred_at === todayISO)
      .reduce((s, t) => s + Number(t.valor), 0);
    const spentBeforeToday = cash
      .filter((t) => t.occurred_at < todayISO)
      .reduce((s, t) => s + Number(t.valor), 0);
    const monthlyCommitments = inst.reduce((s, t) => s + Number(t.valor), 0);
    return computeQuota({
      income,
      fixedCosts,
      savingsMode,
      savingsAmount,
      savingsPercent,
      spentBeforeToday,
      spentToday,
      monthlyCommitments,
      today,
    });
  }

  const quota = useMemo(() => quotaFrom(txs), [txs]); // eslint-disable-line react-hooks/exhaustive-deps

  function register() {
    if (valor <= 0) return;
    const n = isCard ? Math.max(1, installments) : 1;
    // captura os valores antes de limpar o formulário
    const snapshot = { valor, descricao, categoria, pagamento, n };
    startTransition(async () => {
      try {
        const pay = decodePayment(pagamento);
        const created = await createTransaction({
          valor,
          descricao,
          categoria,
          occurred_at: data,
          payment_method: pay.payment_method,
          card_id: pay.card_id,
          installments: n,
        });
        // só as parcelas/lançamentos que caem no mês exibido entram na lista
        const thisMonth = created.filter(
          (t) => t.occurred_at.slice(0, 7) === currentMonth,
        );
        const next = [...thisMonth, ...txs];
        setTxs(next);
        setValor(0);
        setDescricao("");
        setInstallments(1);
        // o veredito (IA) vem depois, com seu próprio loading — não trava o form
        void emitVerdict(next, snapshot);
      } catch {
        setVerdict("Não consegui registrar. Tente de novo.");
      }
    });
  }

  // Modo Roast: pede o veredito à persona (IA) sobre o gasto recém-lançado.
  // A server action já cai no fallback determinístico se a IA falhar.
  async function emitVerdict(
    list: Transaction[],
    s: {
      valor: number;
      descricao: string;
      categoria: string;
      pagamento: string;
      n: number;
    },
  ) {
    const q = quotaFrom(list);
    const per = round2(s.valor / s.n);
    const fallback =
      s.n > 1 ? localInstallmentVerdict(s.n, per) : localVerdict(q);
    const pay = decodePayment(s.pagamento);
    setVerdict(null);
    setVerdictLoading(true);
    try {
      const text = await getVerdict(
        {
          valor: s.valor,
          descricao: s.descricao,
          categoria: s.categoria,
          pagamento: paymentLabel(pay.payment_method, pay.card_id, cards),
          installments: s.n,
          perInstallment: per,
          idealDaily: q.idealDaily,
          maxDaily: q.maxDaily,
          leftTodayIdeal: q.leftTodayIdeal,
          leftTodayMax: q.leftTodayMax,
          spentToday: q.spentToday,
          monthBalance: q.monthBalance,
          monthlyCommitments: q.monthlyCommitments,
          workHours: workHours(s.valor, income) ?? 0,
        },
        fallback,
      );
      setVerdict(text);
    } finally {
      setVerdictLoading(false);
    }
  }

  function remove(t: Transaction) {
    if (t.purchase_id) {
      // remove a compra parcelada inteira
      setTxs((ts) => ts.filter((x) => x.purchase_id !== t.purchase_id));
      startTransition(() => void deletePurchase(t.purchase_id!));
    } else {
      setTxs((ts) => ts.filter((x) => x.id !== t.id));
      startTransition(() => void deleteTransaction(t.id));
    }
  }

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of txs) {
      const arr = map.get(t.occurred_at) ?? [];
      arr.push(t);
      map.set(t.occurred_at, arr);
    }
    return Array.from(map.entries());
  }, [txs]);

  const hpRatio =
    quota.survival > 0
      ? Math.max(0, Math.min(100, (quota.monthBalance / quota.survival) * 100))
      : 0;
  const hpLow = hpRatio < 20;

  return (
    <main className="flex-1 px-8 py-10 overflow-auto">
      <p className="text-solar text-xs uppercase tracking-[0.3em] mb-2">
        Lançamentos
      </p>
      <h1 className="font-display text-3xl uppercase mb-8">O que você queimou</h1>

      <div className="grid lg:grid-cols-[360px_1fr] gap-8 max-w-6xl">
        {/* Coluna esquerda: resumo + registro */}
        <div>
          {/* Resumo do dia */}
          <Card className="mb-6">
            <CardContent className="p-6">
            <p className="text-subtle text-xs uppercase tracking-[0.25em] mb-2">
              Sobra hoje
            </p>
            <p
              className={`font-display text-6xl tracking-tight leading-none ${
                quota.leftTodayIdeal < 0 ? "text-furia" : "text-solar"
              }`}
            >
              {formatBRL(quota.leftTodayIdeal)}
            </p>
            <p className="text-dim text-sm mt-3">
              Cota ideal de hoje: {formatBRL(quota.idealDaily)} · Teto:{" "}
              {formatBRL(quota.maxDaily)}
            </p>
            <p className="text-dim text-sm">
              Gasto hoje: <span className="text-fg">{formatBRL(quota.spentToday)}</span>
            </p>
            {quota.monthlyCommitments > 0 && (
              <p className="text-dim text-sm">
                Parcelas do mês:{" "}
                <span className="text-fg">
                  {formatBRL(quota.monthlyCommitments)}
                </span>
              </p>
            )}

            <div className="mt-5">
              <div className="flex justify-between text-xs text-subtle uppercase tracking-[0.2em] mb-2">
                <span>Saldo do mês</span>
                <span>{formatBRL(quota.monthBalance)}</span>
              </div>
              <div className="h-3 bg-abismo border border-line">
                <div
                  className={hpLow ? "h-full bg-furia" : "h-full bg-solar"}
                  style={{ width: `${hpRatio}%` }}
                />
              </div>
            </div>
            </CardContent>
          </Card>

          {/* Registro rápido */}
          <Card>
            <CardContent className="p-6">
            <p className="text-subtle text-xs uppercase tracking-[0.25em] mb-3">
              Registrar gasto
            </p>

            <div className="flex items-baseline gap-2 border-b border-line pb-3 mb-4">
              <span className="font-display text-3xl text-solar/50">R$</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={valor || ""}
                placeholder="0,00"
                onChange={(e) => setValor(Number(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && register()}
                className="min-w-0 flex-1 bg-transparent outline-none font-display text-4xl text-solar tracking-tight placeholder:text-solar/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>

            {valor > 0 && workHoursLabel(valor, income) && (
              <p className="-mt-2 mb-3 text-subtle text-xs">
                ≈ {workHoursLabel(valor, income)} do seu trabalho
              </p>
            )}

            <Input
              value={descricao}
              placeholder="No quê? (ex: Outback)"
              onChange={(e) => setDescricao(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && register()}
              className="mb-3"
            />

            <div className="mb-3">
              <TypeCombobox
                value={categoria}
                options={categories}
                placeholder="Categoria"
                onChange={setCategoria}
                onCreate={(v) =>
                  setCategories((c) =>
                    c.some((t) => t.toLowerCase() === v.toLowerCase())
                      ? c
                      : [...c, v],
                  )
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-line bg-abismo">
                <SelectMenu
                  value={pagamento}
                  options={paymentOptions(cards)}
                  allowEmpty={false}
                  onChange={setPagamento}
                />
              </div>
              <div className="border border-line bg-abismo">
                <DateField
                  value={data}
                  onChange={(iso) => setData(iso ?? todayISO)}
                />
              </div>
            </div>

            {isCard && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-subtle text-xs uppercase tracking-[0.15em]">
                  Parcelas
                </span>
                <input
                  type="number"
                  min={1}
                  max={48}
                  value={installments}
                  onChange={(e) =>
                    setInstallments(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-16 bg-abismo border border-line focus:border-solar outline-none px-2 py-1.5 text-fg text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-dim text-sm">
                  x
                  {installments > 1 && valor > 0 && (
                    <> de {formatBRL(round2(valor / installments))}</>
                  )}
                </span>
              </div>
            )}

            <Button
              type="button"
              onClick={register}
              disabled={pending || valor <= 0}
              className="w-full font-bold tracking-tight"
            >
              {pending ? "Registrando…" : "Registrar gasto"}
            </Button>

            {verdictLoading && (
              <p className="mt-4 text-sm leading-relaxed border-l-2 border-solar pl-3 text-dim animate-pulse">
                O Sovina avalia…
              </p>
            )}
            {!verdictLoading && verdict && (
              <p
                className={`mt-4 text-sm leading-relaxed border-l-2 pl-3 ${
                  quota.leftTodayMax < 0
                    ? "border-furia text-furia"
                    : "border-solar text-dim"
                }`}
              >
                {verdict}
              </p>
            )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita: histórico do mês */}
        <div>
          <p className="text-subtle text-xs uppercase tracking-[0.25em] mb-4">
            Este mês — {formatBRL(quota.monthSpent)} queimados
          </p>

          {groups.length === 0 && (
            <p className="text-subtle text-sm border border-line p-6">
              Nenhum gasto registrado neste mês. Por enquanto.
            </p>
          )}

          <div className="flex flex-col gap-6">
            {groups.map(([day, items]) => {
              const dayTotal = items.reduce((s, t) => s + Number(t.valor), 0);
              return (
                <div key={day}>
                  <div className="flex justify-between items-baseline border-b border-line pb-1 mb-2">
                    <span className="text-fg text-sm font-bold tracking-tight">
                      {day === todayISO ? "Hoje" : isoToBR(day)}
                    </span>
                    <span className="text-subtle text-xs">
                      {formatBRL(dayTotal)}
                    </span>
                  </div>
                  <ul className="flex flex-col">
                    {items.map((t) => (
                      <li
                        key={t.id}
                        className="group flex items-center gap-3 py-2 border-b border-line/50"
                      >
                        <span className="flex-1 text-fg text-sm truncate">
                          {t.descricao || (
                            <span className="text-subtle">Sem descrição</span>
                          )}
                          {t.categoria && (
                            <span className="text-subtle"> · {t.categoria}</span>
                          )}
                          <span className="text-subtle">
                            {" "}
                            · {paymentLabel(t.payment_method, t.card_id, cards)}
                          </span>
                          {t.installments_total > 1 && (
                            <span className="text-solar">
                              {" "}
                              · {t.installment_no}/{t.installments_total}
                            </span>
                          )}
                        </span>
                        <span className="flex flex-col items-end leading-tight">
                          <span className="text-fg text-sm tabular-nums">
                            {formatBRL(Number(t.valor))}
                          </span>
                          {workHoursLabel(Number(t.valor), income) && (
                            <span className="text-subtle text-[10px] tabular-nums">
                              {workHoursLabel(Number(t.valor), income)}
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(t)}
                          aria-label="Remover lançamento"
                          className="text-subtle opacity-0 group-hover:opacity-100 hover:text-furia transition-all"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

