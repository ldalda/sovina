import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Já autenticado? Manda direto pro app.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/app");

  const { error } = await searchParams;

  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-line px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight">
          SOVINA
        </Link>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          <p className="text-solar text-xs uppercase tracking-[0.3em] mb-4">
            Acesso ao tribunal
          </p>
          <h1 className="font-display text-4xl uppercase leading-[0.95] mb-8">
            Entre. Sem rodeios.
          </h1>

          {error && (
            <div className="border border-furia/40 bg-furia/[0.06] p-4 mb-6">
              <p className="text-furia text-xs uppercase tracking-[0.2em] mb-1">
                Falha no acesso
              </p>
              <p className="text-fg text-sm">
                {error === "missing_code"
                  ? "Link inválido — tenta de novo."
                  : decodeURIComponent(error)}
              </p>
            </div>
          )}

          <LoginForm />
        </div>
      </section>

      <footer className="border-t border-line px-6 py-4 text-xs text-subtle">
        SOVINA · Razão matemática sobre desejo · v0
      </footer>
    </main>
  );
}
