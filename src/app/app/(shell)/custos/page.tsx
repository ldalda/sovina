import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FIXED_COST_TYPES } from "@/lib/finance/categories";
import {
  ensureFixedCostsMonth,
  monthStart,
} from "@/lib/finance/competencia";
import { CustosTable } from "./CustosTable";
import type { CustomColumn, FixedCostRow } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");
const ym = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

export default async function CustosPage({
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

  const now = new Date();
  const { mes } = await searchParams;
  const [py, pm] = (mes ?? ym(now)).split("-").map(Number);
  const refFirst = new Date(py, (pm ?? 1) - 1, 1);
  const competencia = monthStart(refFirst);

  // replica do mês anterior se este mês ainda estiver vazio
  await ensureFixedCostsMonth(supabase, uid, competencia);

  const [rowsRes, colsRes, catsRes, cardsRes] = await Promise.all([
    supabase
      .from("fixed_costs")
      .select(
        "id,label,categoria,tipo,valor,due_date,payment_method,card_id,custom,position",
      )
      .eq("user_id", uid)
      .eq("competencia", competencia)
      .order("position"),
    supabase
      .from("custom_columns")
      .select("id,key,label,type,position")
      .eq("user_id", uid)
      .eq("table_key", "fixed_costs")
      .order("position"),
    supabase
      .from("categories")
      .select("name")
      .eq("user_id", uid)
      .eq("scope", "fixed_cost")
      .order("name"),
    supabase.from("cards").select("id,nome").eq("user_id", uid).order("position"),
  ]);

  const categories = Array.from(
    new Set([...FIXED_COST_TYPES, ...(catsRes.data ?? []).map((c) => c.name)]),
  );

  const label = refFirst.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  const prevMes = ym(new Date(py, (pm ?? 1) - 2, 1));
  const nextMes = ym(new Date(py, pm ?? 1, 1));

  return (
    <main className="flex-1 px-8 py-10 overflow-auto">
      <p className="text-solar text-xs uppercase tracking-[0.3em] mb-2">
        Custos Fixos
      </p>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl uppercase">
          Obrigações inegociáveis
        </h1>
        <div className="flex items-center gap-1">
          <Link
            href={`/app/custos?mes=${prevMes}`}
            className="px-2 py-1 text-dim hover:text-solar transition-colors"
            aria-label="Mês anterior"
          >
            ◀
          </Link>
          <span className="text-fg text-sm font-bold capitalize w-36 text-center">
            {label}
          </span>
          <Link
            href={`/app/custos?mes=${nextMes}`}
            className="px-2 py-1 text-dim hover:text-solar transition-colors"
            aria-label="Próximo mês"
          >
            ▶
          </Link>
        </div>
      </div>
      <p className="text-dim text-sm mb-8">
        Edite direto na célula — eu salvo sozinho.{" "}
        <span className="text-subtle">Categoria</span> e{" "}
        <span className="text-subtle">Valor</span> alimentam a sua cota. Cada mês
        herda os custos do anterior (Variável entra zerado, pra você confirmar).
      </p>

      <CustosTable
        key={competencia}
        competencia={competencia}
        initialRows={(rowsRes.data ?? []) as unknown as FixedCostRow[]}
        initialColumns={(colsRes.data ?? []) as unknown as CustomColumn[]}
        initialCategories={categories}
        cards={cardsRes.data ?? []}
      />
    </main>
  );
}
