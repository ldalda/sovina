import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeStatement, type StatementCardInput } from "@/lib/finance/statement";
import { CardsManager } from "./CardsManager";
import { StatementCard } from "./StatementCard";
import type { Card } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");

export default async function CartoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const uid = user.id;

  // janela ampla o bastante pra cobrir qualquer ciclo aberto (~45 dias)
  const now = new Date();
  const since = new Date(now);
  since.setDate(since.getDate() - 45);
  const sinceISO = `${since.getFullYear()}-${pad(since.getMonth() + 1)}-${pad(since.getDate())}`;

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
      .gte("occurred_at", sinceISO),
    supabase
      .from("fixed_costs")
      .select("card_id,label,categoria,valor")
      .eq("user_id", uid)
      .not("card_id", "is", null),
  ]);

  const cards = (cardsRes.data ?? []) as unknown as Card[];
  const txs = txRes.data ?? [];
  const fixed = fixedRes.data ?? [];

  const statements = cards.map((c) =>
    computeStatement(c as StatementCardInput, txs, fixed, now),
  );

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
          <p className="text-subtle text-xs uppercase tracking-[0.25em] mb-4">
            Faturas em aberto
          </p>
          <div className="grid lg:grid-cols-2 gap-4 max-w-4xl">
            {statements.map((s) => (
              <StatementCard key={s.cardId} s={s} />
            ))}
          </div>
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
