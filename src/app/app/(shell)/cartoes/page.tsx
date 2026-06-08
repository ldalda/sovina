import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CardsManager } from "./CardsManager";
import type { Card } from "./types";

export default async function CartoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("cards")
    .select("id,nome,closing_day,due_day,limit_amount,position")
    .eq("user_id", user.id)
    .order("position");

  return (
    <main className="flex-1 px-8 py-10 overflow-auto">
      <p className="text-solar text-xs uppercase tracking-[0.3em] mb-2">
        Cartões
      </p>
      <h1 className="font-display text-3xl uppercase mb-1">Seus plásticos</h1>
      <p className="text-dim text-sm mb-8 max-w-xl">
        Cadastre seus cartões. Cada gasto pago neles aponta pra cá — a fatura
        será a soma desses gastos, sem você lançar nada duas vezes.
      </p>

      <CardsManager initialCards={(data ?? []) as unknown as Card[]} />
    </main>
  );
}
