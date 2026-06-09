import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  computeStatement,
  cycleForMonth,
  type StatementCardInput,
} from "@/lib/finance/statement";
import { CardsManager } from "./CardsManager";
import { StatementCard } from "./StatementCard";
import { ImportFatura } from "./ImportFatura";
import type { Card } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");
const ym = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

export default async function CartoesPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const uid = user.id;

  // mês de referência (mês em que a fatura fecha) — default: corrente
  const now = new Date();
  const { mes } = await searchParams;
  const [py, pm] = (mes ?? ym(now)).split("-").map(Number);
  const year = py;
  const month = (pm ?? 1) - 1; // 0-based
  const refFirst = new Date(year, month, 1);
  const competencia = `${year}-${pad(month + 1)}-01`;

  // range amplo o bastante p/ qualquer ciclo que fecha no mês (mês ant. → fim do mês)
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month + 1, 0);
  const rangeStart = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-01`;
  const rangeEnd = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}`;

  const [cardsRes, txRes, fixedRes] = await Promise.all([
    supabase
      .from("cards")
      .select("id,nome,closing_day,due_day,limit_amount,position")
      .eq("user_id", uid)
      .order("position"),
    supabase
      .from("transactions")
      .select("card_id,descricao,categoria,valor,occurred_at")
      .eq("user_id", uid)
      .not("card_id", "is", null)
      .gte("occurred_at", rangeStart)
      .lte("occurred_at", rangeEnd),
    supabase
      .from("fixed_costs")
      .select("card_id,label,categoria,valor")
      .eq("user_id", uid)
      .not("card_id", "is", null)
      .eq("competencia", competencia),
  ]);

  const cards = (cardsRes.data ?? []) as unknown as Card[];
  const txs = txRes.data ?? [];
  const fixed = fixedRes.data ?? [];

  const statements = cards.map((c) =>
    computeStatement(
      c as StatementCardInput,
      txs,
      fixed,
      cycleForMonth(c.closing_day, year, month),
    ),
  );

  const label = refFirst.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  const prevMes = ym(new Date(year, month - 1, 1));
  const nextMes = ym(new Date(year, month + 1, 1));

  return (
    <main className="flex-1 px-8 py-10 overflow-auto">
      <p className="text-solar text-xs uppercase tracking-[0.3em] mb-2">
        Cartões
      </p>
      <h1 className="font-display text-3xl uppercase mb-1">Seus plásticos</h1>
      <p className="text-dim text-sm mb-8 max-w-xl">
        A fatura é a soma dos gastos pagos no cartão dentro do ciclo — sem você
        lançar nada duas vezes.
      </p>

      {statements.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <p className="text-subtle text-xs uppercase tracking-[0.25em]">
              Faturas que fecham em
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={`/app/cartoes?mes=${prevMes}`}
                className="px-2 py-1 text-dim hover:text-solar transition-colors"
                aria-label="Mês anterior"
              >
                ◀
              </Link>
              <span className="text-fg text-sm font-bold capitalize w-36 text-center">
                {label}
              </span>
              <Link
                href={`/app/cartoes?mes=${nextMes}`}
                className="px-2 py-1 text-dim hover:text-solar transition-colors"
                aria-label="Próximo mês"
              >
                ▶
              </Link>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-4 max-w-4xl">
            {statements.map((s) => (
              <StatementCard key={s.cardId} s={s} />
            ))}
          </div>
        </section>
      )}

      {cards.length > 0 && (
        <section className="mb-12">
          <p className="text-subtle text-xs uppercase tracking-[0.25em] mb-4">
            Importar fatura
          </p>
          <ImportFatura cards={cards} />
        </section>
      )}

      <section>
        <p className="text-subtle text-xs uppercase tracking-[0.25em] mb-4">
          Gerenciar cartões
        </p>
        <CardsManager initialCards={cards} />
      </section>
    </main>
  );
}
