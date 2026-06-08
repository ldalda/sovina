import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeQuota } from "@/lib/finance/quota";
import { formatBRL } from "@/lib/format";

export default async function Painel() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const uid = user.id;

  const [incomesRes, costsRes, profileRes] = await Promise.all([
    supabase
      .from("income_sources")
      .select("valor")
      .eq("user_id", uid)
      .eq("section", "receivable"),
    supabase.from("fixed_costs").select("valor").eq("user_id", uid),
    supabase
      .from("profiles")
      .select("savings_mode,savings_amount,savings_percent")
      .eq("id", uid)
      .single(),
  ]);

  const income = (incomesRes.data ?? []).reduce((s, r) => s + Number(r.valor), 0);
  const fixedCosts = (costsRes.data ?? []).reduce((s, r) => s + Number(r.valor), 0);
  const profile = profileRes.data;

  const q = computeQuota({
    income,
    fixedCosts,
    savingsMode: profile?.savings_mode ?? "percent",
    savingsAmount: Number(profile?.savings_amount ?? 0),
    savingsPercent: Number(profile?.savings_percent ?? 0),
  });

  const hoje = new Date().toLocaleDateString("pt-BR", {
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
        {/* Cota do dia */}
        <section className="border border-line p-8 bg-concreto/20">
          <p className="text-subtle text-xs uppercase tracking-[0.25em] mb-3">
            Sua cota ideal hoje
          </p>
          <p className="font-display text-7xl sm:text-8xl text-solar tracking-tight leading-none">
            {formatBRL(q.idealDaily)}
          </p>
          <p className="text-dim text-sm mt-5">
            Teto absoluto:{" "}
            <span className="text-fg font-bold">{formatBRL(q.maxDaily)}/dia</span>{" "}
            — gastar isso zera seu mês.
          </p>

          <div className="mt-8">
            <div className="flex justify-between text-xs text-subtle uppercase tracking-[0.2em] mb-2">
              <span>Sobrevivência do mês</span>
              <span>{formatBRL(q.survival)}</span>
            </div>
            <div className="h-3 bg-abismo border border-line">
              <div
                className="h-full bg-solar"
                style={{ width: q.survival > 0 ? "100%" : "0%" }}
              />
            </div>
            <p className="text-subtle text-xs mt-2">
              {q.daysRemaining} dias restantes neste mês.
            </p>
          </div>
        </section>

        {/* Números frios */}
        <aside className="flex flex-col gap-px bg-line border border-line">
          <Stat label="Renda (recebíveis)" value={formatBRL(income)} />
          <Stat label="Custos fixos" value={formatBRL(fixedCosts)} />
          <Stat
            label="Meta de poupança"
            value={formatBRL(q.savingsTarget)}
            accent={!q.feasible ? "furia" : undefined}
          />
        </aside>
      </div>
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
