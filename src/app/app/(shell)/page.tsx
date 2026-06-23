import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeQuota } from "@/lib/finance/quota";
import { ensureFixedCostsMonth } from "@/lib/finance/competencia";
import { formatBRL } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsAppOptin } from "./WhatsAppOptin";

const pad = (n: number) => String(n).padStart(2, "0");
const sumValor = (rows: { valor: number }[] | null) =>
  (rows ?? []).reduce((s, r) => s + Number(r.valor), 0);

export default async function Painel() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const uid = user.id;

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthEnd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(lastDay)}`;
  const todayISO = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  await ensureFixedCostsMonth(supabase, uid, monthStart);

  const [incomesRes, costsRes, profileRes, txRes] = await Promise.all([
    supabase
      .from("income_sources")
      .select("valor")
      .eq("user_id", uid)
      .eq("section", "receivable"),
    supabase
      .from("fixed_costs")
      .select("valor")
      .eq("user_id", uid)
      .eq("competencia", monthStart),
    supabase
      .from("profiles")
      .select("savings_mode,savings_amount,savings_percent,whatsapp")
      .eq("id", uid)
      .single(),
    supabase
      .from("transactions")
      .select("valor,occurred_at,installments_total")
      .eq("user_id", uid)
      .gte("occurred_at", monthStart)
      .lte("occurred_at", monthEnd),
  ]);

  const income = sumValor(incomesRes.data);
  const fixedCosts = sumValor(costsRes.data);
  const profile = profileRes.data;
  const txs = txRes.data ?? [];
  const cash = txs.filter((t) => t.installments_total === 1);
  const spentToday = cash
    .filter((t) => t.occurred_at === todayISO)
    .reduce((s, t) => s + Number(t.valor), 0);
  const spentBeforeToday = cash
    .filter((t) => t.occurred_at < todayISO)
    .reduce((s, t) => s + Number(t.valor), 0);
  const monthlyCommitments = txs
    .filter((t) => t.installments_total > 1)
    .reduce((s, t) => s + Number(t.valor), 0);

  const q = computeQuota({
    income,
    fixedCosts,
    savingsMode: profile?.savings_mode ?? "percent",
    savingsAmount: Number(profile?.savings_amount ?? 0),
    savingsPercent: Number(profile?.savings_percent ?? 0),
    spentBeforeToday,
    spentToday,
    monthlyCommitments,
    today: now,
  });

  const hpRatio =
    q.survival > 0
      ? Math.max(0, Math.min(100, (q.monthBalance / q.survival) * 100))
      : 0;
  const hpLow = hpRatio < 20;
  const over = q.leftTodayIdeal < 0;

  const hoje = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  return (
    <main className="flex-1 px-8 py-10 overflow-y-auto">
      <p className="text-solar text-xs uppercase tracking-[0.3em] mb-2">
        Tribunal · {hoje}
      </p>
      <h1 className="font-display text-3xl uppercase mb-8">Painel</h1>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 max-w-5xl">
        {/* Sobra de hoje */}
        <Card>
          <CardContent className="p-8">
            <p className="text-subtle text-xs uppercase tracking-[0.25em] mb-3">
              Sobra hoje
            </p>
            <p
              className={`font-display text-7xl sm:text-8xl tracking-tight leading-none ${
                over ? "text-furia" : "text-solar"
              }`}
            >
              {formatBRL(q.leftTodayIdeal)}
            </p>
            <p className="text-dim text-sm mt-5">
              Cota ideal:{" "}
              <span className="text-fg font-bold">{formatBRL(q.idealDaily)}</span>{" "}
              · Teto: {formatBRL(q.maxDaily)} · Gasto hoje:{" "}
              {formatBRL(q.spentToday)}
            </p>

            <div className="mt-8">
              <div className="flex justify-between text-xs text-subtle uppercase tracking-[0.2em] mb-2">
                <span>Saldo do mês</span>
                <span>{formatBRL(q.monthBalance)}</span>
              </div>
              <div className="h-3 bg-abismo border border-line">
                <div
                  className={hpLow ? "h-full bg-furia" : "h-full bg-solar"}
                  style={{ width: `${hpRatio}%` }}
                />
              </div>
              <p className="text-subtle text-xs mt-2">
                {q.daysRemaining} dias restantes neste mês.
              </p>
            </div>

            <Button asChild className="mt-8 font-bold tracking-tight">
              <Link href="/app/lancamentos">Registrar gasto →</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Números frios */}
        <Card className="gap-px overflow-hidden bg-line py-0">
          <Stat label="Renda (recebíveis)" value={formatBRL(income)} />
          <Stat label="Custos fixos" value={formatBRL(fixedCosts)} />
          <Stat
            label="Meta de poupança"
            value={formatBRL(q.savingsTarget)}
            accent={!q.feasible ? "furia" : undefined}
          />
          <Stat label="Gasto no mês" value={formatBRL(q.monthSpent)} />
          {q.monthlyCommitments > 0 && (
            <Stat
              label="Parcelas do mês"
              value={formatBRL(q.monthlyCommitments)}
            />
          )}
        </Card>
      </div>

      {!profile?.whatsapp && (
        <div className="mt-6 max-w-md">
          <WhatsAppOptin />
        </div>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "furia";
}) {
  return (
    <div className="bg-abismo p-5">
      <p className="text-subtle text-xs uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <p
        className={`font-display text-2xl tracking-tight ${
          accent === "furia" ? "text-furia" : "text-fg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
