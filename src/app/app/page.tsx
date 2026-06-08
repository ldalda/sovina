import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function AppHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-line px-6 py-4 flex items-center justify-between">
        <span className="font-display text-2xl tracking-tight">SOVINA</span>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm border border-line px-3 py-1.5 hover:border-furia hover:text-furia transition-colors"
          >
            Sair
          </button>
        </form>
      </header>

      <section className="flex-1 px-6 py-12 max-w-3xl">
        <p className="text-solar text-xs uppercase tracking-[0.3em] mb-4">
          Tribunal aberto
        </p>
        <h1 className="font-display text-5xl uppercase leading-[0.95] mb-6">
          Bem-vindo,<br />
          <span className="text-solar">{user.email}</span>.
        </h1>
        <p className="text-dim text-base leading-relaxed mb-8 max-w-xl">
          O Sovina ainda não te conhece. Pra começar, ele precisa saber quanto
          você ganha e quanto você queima em obrigações inegociáveis. Só
          depois ele decreta sua cota diária.
        </p>

        <div className="border border-line p-6 bg-concreto/30">
          <p className="text-subtle text-xs uppercase tracking-[0.2em] mb-2">
            Próximo passo
          </p>
          <p className="text-fg text-lg font-bold mb-1">
            O Julgamento — onboarding em 3 etapas
          </p>
          <p className="text-dim text-sm">
            Em construção. O Sovina está afiando as garras.
          </p>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-4 text-xs text-subtle">
        SOVINA · Razão matemática sobre desejo · v0
      </footer>
    </main>
  );
}
