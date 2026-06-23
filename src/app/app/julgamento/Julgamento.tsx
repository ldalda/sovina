"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import sovina from "@/assets/sovina-avatar.png";
import { computeQuota, type SavingsMode } from "@/lib/finance/quota";
import { formatBRL } from "@/lib/format";
import { FIXED_COST_TYPES } from "@/lib/finance/categories";
import { TypeCombobox } from "@/components/TypeCombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitJulgamento } from "./actions";

type Receivable = { label: string; valor: number };
type FixedCost = { label: string; categoria: string; valor: number };

const STEPS = ["Recebíveis", "Custos fixos", "O veredito"];

// redirect() do Next sinaliza navegação via uma exceção com digest NEXT_REDIRECT.
function isRedirectError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "digest" in e &&
    typeof (e as { digest?: unknown }).digest === "string" &&
    (e as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export function Julgamento() {
  const [step, setStep] = useState(0);
  const [receivables, setReceivables] = useState<Receivable[]>([
    { label: "Salário", valor: 0 },
  ]);
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([
    { label: "", categoria: "Aluguel", valor: 0 },
  ]);
  const [costTypes, setCostTypes] = useState<string[]>([...FIXED_COST_TYPES]);
  const [autoFocusType, setAutoFocusType] = useState<number | null>(null);
  const [savingsMode, setSavingsMode] = useState<SavingsMode>("percent");
  const [savingsPercent, setSavingsPercent] = useState(10);
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const income = receivables.reduce((s, r) => s + (r.valor || 0), 0);
  const fixedTotal = fixedCosts.reduce((s, c) => s + (c.valor || 0), 0);

  const quota = useMemo(
    () =>
      computeQuota({
        income,
        fixedCosts: fixedTotal,
        savingsMode,
        savingsAmount,
        savingsPercent,
      }),
    [income, fixedTotal, savingsMode, savingsAmount, savingsPercent],
  );

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        await submitJulgamento({
          receivables,
          fixedCosts,
          savings: {
            mode: savingsMode,
            amount: savingsAmount,
            percent: savingsPercent,
          },
        });
      } catch (e) {
        // redirect() lança NEXT_REDIRECT de propósito — deixa o Next navegar
        if (isRedirectError(e)) throw e;
        setError(
          e instanceof Error
            ? e.message
            : "O julgamento travou. Nem isso saiu de graça — tente de novo.",
        );
      }
    });
  }

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <Image
            src={sovina}
            alt="O Sovina"
            width={48}
            className="h-14 w-auto select-none pointer-events-none"
          />
          <div>
            <p className="text-solar text-xs uppercase tracking-[0.3em]">
              O Julgamento
            </p>
            <p className="text-dim text-sm">
              Etapa {step + 1} de {STEPS.length} — {STEPS[step]}
            </p>
          </div>
        </div>

        {/* Indicador de etapas */}
        <div className="flex gap-1 mb-10">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 ${i <= step ? "bg-solar" : "bg-line"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <StepReceivables
            receivables={receivables}
            setReceivables={setReceivables}
            total={income}
          />
        )}

        {step === 1 && (
          <StepFixedCosts
            fixedCosts={fixedCosts}
            setFixedCosts={setFixedCosts}
            total={fixedTotal}
            costTypes={costTypes}
            setCostTypes={setCostTypes}
            autoFocusType={autoFocusType}
            setAutoFocusType={setAutoFocusType}
          />
        )}

        {step === 2 && (
          <StepVeredito
            savingsMode={savingsMode}
            setSavingsMode={setSavingsMode}
            savingsPercent={savingsPercent}
            setSavingsPercent={setSavingsPercent}
            savingsAmount={savingsAmount}
            setSavingsAmount={setSavingsAmount}
            income={income}
            quota={quota}
          />
        )}

        {error && (
          <p className="mt-6 text-furia text-sm border border-furia/40 px-4 py-3">
            {error}
          </p>
        )}

        {/* Navegação */}
        <div className="flex justify-between mt-10">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || pending}
            className="text-dim"
          >
            Voltar
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="font-bold tracking-tight"
            >
              Próximo →
            </Button>
          ) : (
            <Button
              type="button"
              onClick={submit}
              disabled={pending}
              className="font-bold tracking-tight"
            >
              {pending ? "Decretando..." : "Submeter-se ao julgamento"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

/* ── Etapa 1 — Recebíveis ──────────────────────────────────────────── */
function StepReceivables({
  receivables,
  setReceivables,
  total,
}: {
  receivables: Receivable[];
  setReceivables: React.Dispatch<React.SetStateAction<Receivable[]>>;
  total: number;
}) {
  return (
    <div>
      <h1 className="font-display text-4xl uppercase leading-[0.95] mb-3">
        Quanto entra?
      </h1>
      <p className="text-dim text-sm mb-8 max-w-lg">
        Tudo que cai na sua conta todo mês: salário, freelas, aluguéis que você
        recebe. Sem arredondar pra cima. Eu trabalho com a verdade.
      </p>

      <div className="flex flex-col gap-3">
        {receivables.map((r, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={r.label}
              onChange={(e) =>
                setReceivables((rows) =>
                  rows.map((row, j) =>
                    j === i ? { ...row, label: e.target.value } : row,
                  ),
                )
              }
              placeholder="Fonte (ex: Salário)"
              className="flex-1"
            />
            <MoneyInput
              value={r.valor}
              onChange={(v) =>
                setReceivables((rows) =>
                  rows.map((row, j) => (j === i ? { ...row, valor: v } : row)),
                )
              }
            />
            <RemoveButton
              disabled={receivables.length === 1}
              onClick={() =>
                setReceivables((rows) => rows.filter((_, j) => j !== i))
              }
            />
          </div>
        ))}
      </div>

      <AddButton
        label="+ Adicionar fonte"
        onClick={() =>
          setReceivables((rows) => [...rows, { label: "", valor: 0 }])
        }
      />

      <TotalLine label="Renda total" value={total} />
    </div>
  );
}

/* ── Etapa 2 — Custos fixos ────────────────────────────────────────── */
function StepFixedCosts({
  fixedCosts,
  setFixedCosts,
  total,
  costTypes,
  setCostTypes,
  autoFocusType,
  setAutoFocusType,
}: {
  fixedCosts: FixedCost[];
  setFixedCosts: React.Dispatch<React.SetStateAction<FixedCost[]>>;
  total: number;
  costTypes: string[];
  setCostTypes: React.Dispatch<React.SetStateAction<string[]>>;
  autoFocusType: number | null;
  setAutoFocusType: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  return (
    <div>
      <h1 className="font-display text-4xl uppercase leading-[0.95] mb-3">
        O que você não escapa?
      </h1>
      <p className="text-dim text-sm mb-8 max-w-lg">
        Obrigações inegociáveis: aluguel, contas, financiamentos, assinaturas
        que você jura que vai cancelar. Liste sem dó de si mesmo.
      </p>

      <div className="flex flex-col gap-3">
        {fixedCosts.map((c, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={c.label}
              onChange={(e) =>
                setFixedCosts((rows) =>
                  rows.map((row, j) =>
                    j === i ? { ...row, label: e.target.value } : row,
                  ),
                )
              }
              placeholder="Despesa"
              className="flex-1 min-w-0"
            />
            <div className="w-44 shrink-0">
              <TypeCombobox
                value={c.categoria}
                options={costTypes}
                placeholder="Outro: digite"
                autoFocus={i === autoFocusType}
                onChange={(v) =>
                  setFixedCosts((rows) =>
                    rows.map((row, j) =>
                      j === i ? { ...row, categoria: v } : row,
                    ),
                  )
                }
                onCreate={(v) =>
                  setCostTypes((prev) =>
                    prev.some((t) => t.toLowerCase() === v.toLowerCase())
                      ? prev
                      : [...prev, v],
                  )
                }
              />
            </div>
            <MoneyInput
              value={c.valor}
              onChange={(v) =>
                setFixedCosts((rows) =>
                  rows.map((row, j) => (j === i ? { ...row, valor: v } : row)),
                )
              }
            />
            <RemoveButton
              disabled={fixedCosts.length === 1}
              onClick={() =>
                setFixedCosts((rows) => rows.filter((_, j) => j !== i))
              }
            />
          </div>
        ))}
      </div>

      <AddButton
        label="+ Adicionar custo"
        onClick={() => {
          setAutoFocusType(fixedCosts.length);
          setFixedCosts((rows) => [
            ...rows,
            { label: "", categoria: "", valor: 0 },
          ]);
        }}
      />

      <TotalLine label="Custos fixos" value={total} />
    </div>
  );
}

/* ── Etapa 3 — Poupança & veredito ─────────────────────────────────── */
function StepVeredito({
  savingsMode,
  setSavingsMode,
  savingsPercent,
  setSavingsPercent,
  savingsAmount,
  setSavingsAmount,
  income,
  quota,
}: {
  savingsMode: SavingsMode;
  setSavingsMode: (m: SavingsMode) => void;
  savingsPercent: number;
  setSavingsPercent: (n: number) => void;
  savingsAmount: number;
  setSavingsAmount: (n: number) => void;
  income: number;
  quota: ReturnType<typeof computeQuota>;
}) {
  // mantém os dois campos coerentes se a renda mudar (usuário voltou e editou)
  useEffect(() => {
    if (savingsMode === "percent") {
      setSavingsAmount(round2((income * savingsPercent) / 100));
    } else {
      setSavingsPercent(income > 0 ? round2((savingsAmount / income) * 100) : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income]);

  return (
    <div>
      <h1 className="font-display text-4xl uppercase leading-[0.95] mb-3">
        Quanto eu guardo?
      </h1>
      <p className="text-dim text-sm mb-6 max-w-lg">
        Antes de te deixar respirar, eu separo o seu futuro. Escolha quanto — em
        % ou em reais. Eu converto o resto.
      </p>

      {/* % e valor lado a lado, sincronizados pela renda */}
      <div className="grid sm:grid-cols-2 gap-4">
        <SavingsField
          label="% a economizar da renda"
          suffix="%"
          value={savingsPercent}
          active={savingsMode === "percent"}
          onChange={(p) => {
            setSavingsMode("percent");
            setSavingsPercent(p);
            setSavingsAmount(round2((income * p) / 100));
          }}
        />
        <SavingsField
          label="Valor a economizar da renda"
          prefix="R$"
          value={savingsAmount}
          active={savingsMode === "fixed"}
          onChange={(a) => {
            setSavingsMode("fixed");
            setSavingsAmount(a);
            setSavingsPercent(income > 0 ? round2((a / income) * 100) : 0);
          }}
        />
      </div>

      {/* Veredito */}
      <div className="mt-8 border border-line bg-concreto/20 p-6">
        <p className="text-subtle text-xs uppercase tracking-[0.25em] mb-1">
          {quota.feasible ? "Sua cota ideal por dia" : "Inviável"}
        </p>
        <p
          className={`font-display text-6xl tracking-tight leading-none ${
            quota.feasible ? "text-solar" : "text-furia"
          }`}
        >
          {formatBRL(quota.feasible ? quota.idealDaily : quota.savingsTarget)}
        </p>

        <dl className="grid grid-cols-3 gap-px bg-line border border-line mt-6 text-center">
          <Cell label="Sobrevivência" value={formatBRL(quota.survival)} />
          <Cell label="Teto/dia" value={formatBRL(quota.maxDaily)} />
          <Cell label="Dias restantes" value={String(quota.daysRemaining)} />
        </dl>

        <p className="text-dim text-sm leading-relaxed mt-6">
          {veredito(quota)}
        </p>
      </div>
    </div>
  );
}

function veredito(q: ReturnType<typeof computeQuota>): string {
  if (!q.feasible) {
    return `Negado. Sua meta de ${formatBRL(
      q.savingsTarget,
    )} não cabe numa sobrevivência de ${formatBRL(
      q.survival,
    )}. Corte custos ou ganhe mais. Eu não invento dinheiro.`;
  }
  return `Decretado. Restam ${q.daysRemaining} dias neste mês. Você existe com ${formatBRL(
    q.maxDaily,
  )} por dia — mas ${formatBRL(
    q.idealDaily,
  )} se quiser que eu guarde ${formatBRL(
    q.savingsTarget,
  )} até o fim. Ultrapasse e eu saberei.`;
}

/* ── Primitivos ────────────────────────────────────────────────────── */
function MoneyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center border border-line focus-within:border-solar bg-abismo w-36">
      <span className="pl-3 text-dim text-sm">R$</span>
      <input
        type="number"
        min={0}
        step="0.01"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="0,00"
        className="flex-1 min-w-0 bg-transparent py-2 px-2 outline-none text-fg placeholder:text-subtle"
      />
    </div>
  );
}

function RemoveButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      aria-label="Remover"
      className="text-subtle hover:border-furia/40 hover:text-furia"
    >
      ×
    </Button>
  );
}

function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="link"
      onClick={onClick}
      className="mt-3 h-auto p-0 text-solar hover:text-solar/80"
    >
      {label}
    </Button>
  );
}

function TotalLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-baseline mt-8 pt-4 border-t border-line">
      <span className="text-subtle text-xs uppercase tracking-[0.2em]">
        {label}
      </span>
      <span className="font-display text-2xl text-fg tracking-tight">
        {formatBRL(value)}
      </span>
    </div>
  );
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

function SavingsField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  active,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`border p-4 transition-colors ${
        active ? "border-solar" : "border-line focus-within:border-solar"
      }`}
    >
      <p className="text-subtle text-xs uppercase tracking-[0.2em] mb-3">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        {prefix && (
          <span className="font-display text-3xl text-solar/50">{prefix}</span>
        )}
        <input
          type="number"
          min={0}
          step="0.01"
          value={value || ""}
          placeholder="0"
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-w-0 flex-1 bg-transparent outline-none font-display text-4xl sm:text-5xl text-solar tracking-tight placeholder:text-solar/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix && (
          <span className="font-display text-3xl text-solar/50">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-abismo py-3 px-2">
      <p className="text-subtle text-[10px] uppercase tracking-[0.15em] mb-1">
        {label}
      </p>
      <p className="text-fg text-sm font-bold tracking-tight">{value}</p>
    </div>
  );
}
